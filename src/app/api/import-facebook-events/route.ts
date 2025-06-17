import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Vérifier l'authentification
    const user = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { accessToken, pageId } = await request.json()

    if (!accessToken || !pageId) {
      return NextResponse.json(
        { error: 'Token d\'accès et ID de page requis' },
        { status: 400 }
      )
    }

    // Récupérer les événements depuis Facebook (comme dans le script)
    const fields = [
      'id',
      'name', 
      'description',
      'start_time',
      'end_time',
      'cover',
      'place',
      'event_times',
      'is_canceled',
      'updated_time'
    ].join(',')

    const facebookUrl = `https://graph.facebook.com/v18.0/${pageId}/events`
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: fields,
      time_filter: 'upcoming',
      limit: '50',
    })
    
    const facebookResponse = await fetch(`${facebookUrl}?${params}`)
    const facebookData = await facebookResponse.json()

    if (facebookData.error) {
      return NextResponse.json(
        { error: `Erreur Facebook: ${facebookData.error.message}` },
        { status: 400 }
      )
    }

    const events = facebookData.data || []
    let imported = 0
    let skipped = 0
    let errors = 0

    // Fonction pour formater l'heure (inspirée du script)
    const formatTime = (facebookStartTime: string) => {
      if (!facebookStartTime) return null
      
      try {
        const date = new Date(facebookStartTime)
        const hours = date.getHours()
        const minutes = date.getMinutes()
        
        const formattedHours = hours.toString()
        const formattedMinutes = minutes.toString().padStart(2, '0')
        
        return `${formattedHours}h${formattedMinutes}`
      } catch (_error) {
        return null
      }
    }

    // Fonction pour vérifier si un événement existe déjà
    const eventExists = async (facebookEventId: string) => {
      try {
        const existing = await payload.find({
          collection: 'events',
          where: {
            facebookLink: {
              contains: facebookEventId,
            },
          },
          limit: 1,
        })
        return existing.docs && existing.docs.length > 0
      } catch (_error) {
        return false
      }
    }

    // Fonction pour uploader une image Facebook vers Payload
    const uploadImageToPayload = async (imageUrl: string, eventName: string) => {
      if (!imageUrl) return null

      try {
        console.log(`Téléchargement image pour ${eventName}: ${imageUrl}`)
        
        // Télécharger l'image depuis Facebook
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          console.error(`Erreur téléchargement image: ${imageResponse.status}`)
          return null
        }

        const imageBuffer = await imageResponse.arrayBuffer()
        const filename = `event-cover-${Date.now()}.jpg`

        console.log(`Image téléchargée, taille: ${imageBuffer.byteLength} bytes`)

        // Utiliser l'API Payload directement au lieu de fetch
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `Cover Facebook - ${eventName}`,
            caption: `Cover de l'événement ${eventName}`,
          },
          file: {
            data: Buffer.from(imageBuffer),
            mimetype: 'image/jpeg',
            name: filename,
            size: imageBuffer.byteLength,
          },
        })

        console.log(`Image uploadée avec succès: ${mediaDoc.id}`)
        return mediaDoc.id

      } catch (error) {
        console.error(`Erreur upload image pour ${eventName}:`, error)
        return null
      }
    }

    // Traitement de chaque événement
    for (const fbEvent of events) {
      try {
        // Vérifier si l'événement existe déjà
        const exists = await eventExists(fbEvent.id)
        if (exists) {
          skipped++
          continue
        }

        // Upload du cover Facebook si disponible
        let facebookCoverId = null
        if (fbEvent.cover && fbEvent.cover.source) {
          facebookCoverId = await uploadImageToPayload(fbEvent.cover.source, fbEvent.name)
        }

        // Générer un slug unique (comme dans le script)
        const slug = fbEvent.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')

        // Extraire l'heure de start_time
        const eventTime = formatTime(fbEvent.start_time)

        // Récupérer la configuration Facebook avec les règles d'affiches
        const facebookConfig = await payload.findGlobal({
          slug: 'facebook-config',
          depth: 2,
        })
        
        // Fonction pour trouver le genre approprié et l'affiche selon les règles
        let genreId: string | number | null = null
        let assignedPosterId: string | null = null
        
        const findGenreAndPoster = async (title: string) => {
          const lowerTitle = title.toLowerCase()
          
          // Récupérer tous les genres
          const genres = await payload.find({
            collection: 'event-genres',
            limit: 100,
          })
          
          // 1. D'abord, chercher le genre selon les mots-clés des genres
          for (const genre of genres.docs) {
            if (genre.keywords && Array.isArray(genre.keywords)) {
              for (const keywordObj of genre.keywords) {
                if (keywordObj.keyword && lowerTitle.includes(keywordObj.keyword.toLowerCase())) {
                  genreId = genre.id
                  break
                }
              }
              if (genreId) break
            }
          }
          
          // 2. Ensuite, appliquer les règles d'affiches de la configuration
          const posterRules = facebookConfig.posterRules || []
          let bestRule = null
          let highestPriority = 0
          
          for (const rule of posterRules) {
            let ruleMatches = false
            
            // Vérifier si la règle s'applique par genre
            if (rule.genre && genreId && typeof rule.genre === 'object' && 'id' in rule.genre && rule.genre.id === genreId) {
              ruleMatches = true
            }
            
            // Vérifier si la règle s'applique par mots-clés
            if (rule.keywords && Array.isArray(rule.keywords)) {
              for (const keywordObj of rule.keywords) {
                if (keywordObj.keyword && lowerTitle.includes(keywordObj.keyword.toLowerCase())) {
                  ruleMatches = true
                  break
                }
              }
            }
            
            // Si la règle s'applique et a une priorité plus élevée
            if (ruleMatches && (rule.priority || 1) >= highestPriority) {
              highestPriority = rule.priority || 1
              bestRule = rule
            }
          }
          
          if (bestRule && bestRule.poster) {
            if (typeof bestRule.poster === 'object' && 'id' in bestRule.poster) {
              assignedPosterId = bestRule.poster.id
              console.log(`Affiche assignée par règle (priorité ${highestPriority}): ${('filename' in bestRule.poster ? bestRule.poster.filename : 'ID ' + assignedPosterId)}`)
            } else {
              assignedPosterId = bestRule.poster as string
              console.log(`Affiche assignée par règle (priorité ${highestPriority}): ID ${assignedPosterId}`)
            }
          }
          
          return { genreId, assignedPosterId }
        }
        
        // Trouver le genre et l'affiche selon les règles
        const { genreId: foundGenreId, assignedPosterId: foundPosterId } = await findGenreAndPoster(fbEvent.name)

        // Préparer les données de l'événement
        const eventData = {
          title: fbEvent.name,
          slug: `${slug}-${fbEvent.id}`, // Ajouter l'ID FB pour l'unicité
          date: fbEvent.start_time ? fbEvent.start_time.split('T')[0] : new Date().toISOString().split('T')[0],
          time: eventTime,
          genre: foundGenreId, // Assigner le genre trouvé
          image: foundPosterId as number | null, // Assigner l'affiche selon les règles
          facebookCover: facebookCoverId, // Cover Facebook
          facebookLink: `https://www.facebook.com/events/${fbEvent.id}`,
          status: (fbEvent.is_canceled ? 'archived' : 'published') as 'published' | 'draft' | 'archived',
        }

        // Créer l'événement
        await payload.create({
          collection: 'events',
          data: eventData,
        })

        imported++

        // Pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.error(`Erreur traitement ${fbEvent.name}:`, error)
        errors++
      }
    }

    // Mettre à jour la date de dernière importation
    await payload.updateGlobal({
      slug: 'facebook-config',
      data: {
        lastImport: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Import terminé: ${imported} événements importés, ${skipped} ignorés, ${errors} erreurs`,
      imported,
      skipped,
      errors,
    })

  } catch (error) {
    console.error('Erreur import Facebook:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'import' },
      { status: 500 }
    )
  }
}