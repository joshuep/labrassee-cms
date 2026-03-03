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

    // Fonction pour formater l'heure avec fuseau horaire America/Montreal
    const formatTime = (facebookStartTime: string) => {
      if (!facebookStartTime) return null
      
      const date = new Date(facebookStartTime)
      
      try {
        // Approche plus robuste avec Intl.DateTimeFormat
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Montreal',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        })
        
        const formatted = timeFormatter.format(date)
        
        // Le format devrait être "HH:MM"
        const [hours, minutes] = formatted.split(':')
        return `${hours}h${minutes}`
      } catch (_error) {
        // Fallback : calcul manuel de l'offset Montreal avec DST
        try {
          const utcHours = date.getUTCHours()
          const utcMinutes = date.getUTCMinutes()
          
          // Détecter l'heure d'été (DST) au Canada
          // DST : 2e dimanche de mars au 1er dimanche de novembre
          const year = date.getFullYear()
          const month = date.getMonth()
          const dayOfMonth = date.getDate()
          
          let isDST = false
          
          if (month > 2 && month < 10) { // Avril à octobre
            isDST = true
          } else if (month === 2) { // Mars
            // 2e dimanche de mars
            const secondSunday = 14 - new Date(year, 2, 14).getDay()
            isDST = dayOfMonth >= secondSunday
          } else if (month === 10) { // Novembre  
            // 1er dimanche de novembre
            const firstSunday = 7 - new Date(year, 10, 7).getDay()
            isDST = dayOfMonth < firstSunday
          }
          
          // UTC-4 en été, UTC-5 en hiver
          const offset = isDST ? 4 : 5
          let montrealHours = utcHours - offset
          if (montrealHours < 0) montrealHours += 24
          
          return `${montrealHours}h${utcMinutes.toString().padStart(2, '0')}`
        } catch {
          return null
        }
      }
    }

    // Fonction pour formater la date avec fuseau horaire America/Montreal
    const formatDate = (facebookStartTime: string) => {
      if (!facebookStartTime) return new Date().toISOString()
      
      try {
        const date = new Date(facebookStartTime)
        
        // Obtenir la date en fuseau Montreal
        const montrealDate = date.toLocaleDateString('en-CA', { 
          timeZone: 'America/Montreal',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        
        // Retourner la date avec l'heure à midi UTC pour éviter les décalages
        // Cela garantit que la date reste correcte peu importe le fuseau horaire d'affichage
        return `${montrealDate}T12:00:00.000Z`
      } catch (_error) {
        return new Date().toISOString()
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
        // Upload du cover Facebook si disponible (une seule fois par événement)
        let facebookCoverId = null
        if (fbEvent.cover && fbEvent.cover.source) {
          facebookCoverId = await uploadImageToPayload(fbEvent.cover.source, fbEvent.name)
        }

        // Générer un slug de base (comme dans le script)
        const baseSlug = fbEvent.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')

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
              assignedPosterId = String(bestRule.poster.id)
              console.log(`Affiche assignée par règle (priorité ${highestPriority}): ${('filename' in bestRule.poster ? bestRule.poster.filename : 'ID ' + assignedPosterId)}`)
            } else {
              assignedPosterId = String(bestRule.poster)
              console.log(`Affiche assignée par règle (priorité ${highestPriority}): ID ${assignedPosterId}`)
            }
          }
          
          return { genreId, assignedPosterId }
        }
        
        // Trouver le genre et l'affiche selon les règles (une seule fois par événement)
        const { genreId: foundGenreId, assignedPosterId: foundPosterId } = await findGenreAndPoster(fbEvent.name)

        // Traiter les dates multiples : event_times ou fallback sur start_time
        const eventTimes = fbEvent.event_times && fbEvent.event_times.length > 0 
          ? fbEvent.event_times 
          : [{ start_time: fbEvent.start_time, end_time: fbEvent.end_time }]

        console.log(`Événement "${fbEvent.name}" a ${eventTimes.length} date(s)`)

        // Créer un événement pour chaque date
        for (let i = 0; i < eventTimes.length; i++) {
          const eventTime = eventTimes[i]
          const eventDate = eventTime.start_time
          
          // Vérifier si un événement avec cette date spécifique existe déjà
          const dateSlug = new Date(eventDate).toISOString().split('T')[0] // YYYY-MM-DD
          const uniqueSlug = `${baseSlug}-${fbEvent.id}-${dateSlug}`
          
          const exists = await payload.find({
            collection: 'events',
            where: {
              slug: {
                equals: uniqueSlug,
              },
            },
            limit: 1,
          })
          
          if (exists.docs && exists.docs.length > 0) {
            console.log(`Événement déjà existant pour la date ${dateSlug}, ignoré`)
            skipped++
            continue
          }

          // Extraire l'heure de cette occurrence spécifique
          const formattedTime = formatTime(eventDate)

          // Préparer les données de l'événement pour cette date
          const eventData = {
            title: fbEvent.name,
            slug: uniqueSlug,
            date: formatDate(eventDate),
            time: formattedTime,
            genre: foundGenreId ? Number(foundGenreId) : null,
            image: foundPosterId ? Number(foundPosterId) : null,
            facebookCover: facebookCoverId,
            facebookLink: `https://www.facebook.com/events/${fbEvent.id}`,
            status: (fbEvent.is_canceled ? 'archived' : 'published') as 'published' | 'draft' | 'archived',
          }

          // Créer l'événement pour cette date
          await payload.create({
            collection: 'events',
            data: eventData,
          })

          imported++
          console.log(`Créé: ${eventData.title} le ${formatDate(eventDate)} à ${formattedTime}`)

          // Pause pour éviter de surcharger l'API
          await new Promise(resolve => setTimeout(resolve, 200))
        }

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
