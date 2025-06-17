import { getPayload, Payload } from 'payload'
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

    const { type } = await request.json()

    if (type === 'event-genres') {
      return await seedEventGenres(payload)
    } else if (type === 'menu-items') {
      return await seedMenuItems(payload)
    } else if (type === 'all') {
      return await seedAll(payload)
    } else {
      return NextResponse.json(
        { error: 'Type de seed non supporté' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Erreur seed:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors du seed' },
      { status: 500 }
    )
  }
}

async function seedEventGenres(payload: Payload) {
  try {
    // Définition des 18 genres avec leurs mots-clés
    const genres = [
      {
        title: 'Jazz',
        slug: 'jazz',
        keywords: [
          { keyword: 'miss t jazz' },
          { keyword: 'jazz' },
          { keyword: 'cafe bohemia' }
        ],
        description: 'Musique jazz et concerts intimistes'
      },
      {
        title: 'Impro',
        slug: 'impro',
        keywords: [
          { keyword: 'programme double' },
          { keyword: 'match' },
          { keyword: 'finale' },
          { keyword: 'demi-finale' },
          { keyword: 'impro' }
        ],
        description: 'Théâtre d\'improvisation et matchs'
      },
      {
        title: 'Science',
        slug: 'science',
        keywords: [
          { keyword: '5àscience' },
          { keyword: '5@science' },
          { keyword: 'conférence' },
          { keyword: 'science' }
        ],
        description: 'Conférences scientifiques et vulgarisation'
      },
      {
        title: 'Musique électronique',
        slug: 'electronique',
        keywords: [
          { keyword: 'électronique' },
          { keyword: 'electro' },
          { keyword: 'techno' },
          { keyword: 'house' }
        ],
        description: 'Musique électronique et DJ sets'
      },
      {
        title: 'Folk',
        slug: 'folk',
        keywords: [
          { keyword: 'folk' },
          { keyword: 'acoustique' },
          { keyword: 'chanson' }
        ],
        description: 'Musique folk et acoustique'
      },
      {
        title: 'Rock',
        slug: 'rock',
        keywords: [
          { keyword: 'rock' },
          { keyword: 'punk' },
          { keyword: 'métal' },
          { keyword: 'metal' }
        ],
        description: 'Rock, punk et metal'
      },
      {
        title: 'Hip-Hop',
        slug: 'hip-hop',
        keywords: [
          { keyword: 'hip-hop' },
          { keyword: 'rap' },
          { keyword: 'beatbox' }
        ],
        description: 'Hip-hop, rap et culture urbaine'
      },
      {
        title: 'Théâtre',
        slug: 'theatre',
        keywords: [
          { keyword: 'théâtre' },
          { keyword: 'pièce' },
          { keyword: 'spectacle' },
          { keyword: 'monologue' }
        ],
        description: 'Théâtre et art dramatique'
      },
      {
        title: 'Poésie',
        slug: 'poesie',
        keywords: [
          { keyword: 'poésie' },
          { keyword: 'slam' },
          { keyword: 'spoken word' }
        ],
        description: 'Poésie, slam et spoken word'
      },
      {
        title: 'Humour',
        slug: 'humour',
        keywords: [
          { keyword: 'humour' },
          { keyword: 'stand-up' },
          { keyword: 'comédie' },
          { keyword: 'one-man-show' }
        ],
        description: 'Stand-up et spectacles humoristiques'
      },
      {
        title: 'Monde',
        slug: 'monde',
        keywords: [
          { keyword: 'world' },
          { keyword: 'traditionnel' },
          { keyword: 'ethnique' }
        ],
        description: 'Musiques du monde et traditionnelles'
      },
      {
        title: 'Classique',
        slug: 'classique',
        keywords: [
          { keyword: 'classique' },
          { keyword: 'orchestre' },
          { keyword: 'piano' },
          { keyword: 'violon' }
        ],
        description: 'Musique classique et instrumentale'
      },
      {
        title: 'Soirée thématique',
        slug: 'soiree-thematique',
        keywords: [
          { keyword: 'soirée' },
          { keyword: 'thématique' },
          { keyword: 'party' },
          { keyword: 'célébration' }
        ],
        description: 'Soirées à thème et célébrations'
      },
      {
        title: 'Danse',
        slug: 'danse',
        keywords: [
          { keyword: 'danse' },
          { keyword: 'ballet' },
          { keyword: 'contemporain' }
        ],
        description: 'Spectacles de danse'
      },
      {
        title: 'Exposition',
        slug: 'exposition',
        keywords: [
          { keyword: 'exposition' },
          { keyword: 'vernissage' },
          { keyword: 'art' },
          { keyword: 'galerie' }
        ],
        description: 'Expositions d\'art et vernissages'
      },
      {
        title: 'Conférence',
        slug: 'conference',
        keywords: [
          { keyword: 'conférence' },
          { keyword: 'débat' },
          { keyword: 'discussion' }
        ],
        description: 'Conférences et débats'
      },
      {
        title: 'Atelier',
        slug: 'atelier',
        keywords: [
          { keyword: 'atelier' },
          { keyword: 'workshop' },
          { keyword: 'formation' }
        ],
        description: 'Ateliers et formations'
      },
      {
        title: 'Événement spécial',
        slug: 'evenement-special',
        keywords: [
          { keyword: 'spécial' },
          { keyword: 'unique' },
          { keyword: 'exceptionnel' }
        ],
        description: 'Événements uniques et exceptionnels'
      }
    ]

    let created = 0
    let skipped = 0

    for (const genreData of genres) {
      try {
        // Vérifier si le genre existe déjà
        const existing = await payload.find({
          collection: 'event-genres',
          where: {
            slug: {
              equals: genreData.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`Genre ${genreData.title} déjà existant`)
          skipped++
          continue
        }

        // Créer le genre
        await payload.create({
          collection: 'event-genres',
          data: genreData,
        })

        console.log(`Genre ${genreData.title} créé`)
        created++

      } catch (error) {
        console.error(`Erreur création genre ${genreData.title}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seed des genres terminé: ${created} créés, ${skipped} ignorés`,
      created,
      skipped,
    })

  } catch (error) {
    console.error('Erreur seed genres:', error)
    return NextResponse.json(
      { error: 'Erreur lors du seed des genres' },
      { status: 500 }
    )
  }
}

async function seedMenuItems(payload: Payload) {
  try {
    // Définition des pages de menu basées sur votre JSON
    const menuItems = [
      {
        title: 'Page de garde',
        slug: 'page-de-garde',
        description: 'Au coeur de Rosepatrie',
        order: 1,
        status: 'published',
      },
      {
        title: 'C\'est nouveau',
        slug: 'cest-nouveau',
        description: 'Nos nouveautés et dernières créations',
        order: 2,
        status: 'published',
      },
      {
        title: 'Nos plats du jour',
        slug: 'plats-du-jour',
        description: 'Découvrez nos plats du jour préparés avec amour',
        order: 3,
        status: 'published',
      },
      {
        title: 'Nos repas',
        slug: 'nos-repas',
        description: 'Une sélection de repas savoureux',
        order: 4,
        status: 'published',
      },
      {
        title: 'Nos pâtisseries',
        slug: 'nos-patisseries',
        description: 'Pâtisseries artisanales et gourmandises',
        order: 5,
        status: 'published',
      },
      {
        title: 'Nos cafés',
        slug: 'nos-cafes',
        description: 'Une sélection de cafés d\'exception',
        order: 6,
        status: 'published',
      },
      {
        title: 'Nos thés',
        slug: 'nos-thes',
        description: 'Thés fins et infusions maison',
        order: 7,
        status: 'published',
      },
      {
        title: 'Nos alcools',
        slug: 'nos-alcools',
        description: 'Bières artisanales et spiritueux',
        order: 8,
        status: 'published',
      },
      {
        title: 'Nos rafraîchissements',
        slug: 'nos-rafraichissements',
        description: 'Boissons fraîches et naturelles',
        order: 9,
        status: 'published',
      },
      {
        title: 'Nos cocktails',
        slug: 'nos-cocktails',
        description: 'Cocktails créatifs et signatures',
        order: 10,
        status: 'published',
      },
    ]

    let created = 0
    let skipped = 0

    for (const menuItemData of menuItems) {
      try {
        // Vérifier si l'item de menu existe déjà
        const existing = await payload.find({
          collection: 'menu-items',
          where: {
            slug: {
              equals: menuItemData.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`Menu item ${menuItemData.title} déjà existant`)
          skipped++
          continue
        }

        // Créer l'item de menu
        await payload.create({
          collection: 'menu-items',
          data: menuItemData,
        })

        console.log(`Menu item ${menuItemData.title} créé`)
        created++

      } catch (error) {
        console.error(`Erreur création menu item ${menuItemData.title}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seed des pages de menu terminé: ${created} créées, ${skipped} ignorées`,
      created,
      skipped,
    })

  } catch (error) {
    console.error('Erreur seed menu items:', error)
    return NextResponse.json(
      { error: 'Erreur lors du seed des pages de menu' },
      { status: 500 }
    )
  }
}

async function seedAll(payload: Payload) {
  try {
    let totalCreated = 0

    // 1. Seed des genres d'événements
    const genresResult = await seedEventGenres(payload)
    const genresData = await genresResult.json()
    totalCreated += genresData.created || 0

    // 2. Seed des pages de menu
    const menuResult = await seedMenuItems(payload)
    const menuData = await menuResult.json()
    totalCreated += menuData.created || 0

    return NextResponse.json({
      success: true,
      message: `Seed complet terminé: ${totalCreated} éléments créés au total`,
      totalCreated,
      details: {
        genres: genresData.created || 0,
        menuItems: menuData.created || 0,
      },
    })

  } catch (error) {
    console.error('Erreur seed complet:', error)
    return NextResponse.json(
      { error: 'Erreur lors du seed complet' },
      { status: 500 }
    )
  }
}