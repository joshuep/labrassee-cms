import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Nom de l\'événement',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identifiant unique pour l\'événement (utilisé dans l\'URL)',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Date de l\'événement',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'time',
      type: 'text',
      admin: {
        description: 'Heure de l\'événement (ex: 20h00, 19h30)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Affiche officielle de l\'événement (optionnel)',
      },
    },
    {
      name: 'facebookCover',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image de couverture Facebook (utilisée si pas d\'affiche officielle)',
      },
    },
    {
      name: 'facebookLink',
      type: 'text',
      admin: {
        description: 'Lien vers l\'événement Facebook (optionnel)',
      },
      validate: (val?: string | null) => {
        if (val && !val.includes('facebook.com')) {
          return 'Le lien doit être un lien Facebook valide'
        }
        return true
      },
    },
    {
      name: 'genre',
      type: 'relationship',
      relationTo: 'event-genres',
      admin: {
        description: 'Genre de l\'événement (automatiquement assigné selon le titre)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        {
          label: 'Publié',
          value: 'published',
        },
        {
          label: 'Brouillon',
          value: 'draft',
        },
        {
          label: 'Archivé',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Statut de publication de l\'événement',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Auto-générer le slug si pas fourni
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }

        // Auto-assigner le genre selon le titre
        if (data.title && !data.genre) {
          const title = data.title.toLowerCase()
          
          try {
            // Récupérer tous les genres
            const genres = await req.payload.find({
              collection: 'event-genres',
              limit: 0, // Get all genres
            })

            // Chercher le premier genre qui match
            for (const genre of genres.docs) {
              if (genre.keywords && Array.isArray(genre.keywords)) {
                for (const keywordObj of genre.keywords) {
                  if (keywordObj.keyword && title.includes(keywordObj.keyword.toLowerCase())) {
                    data.genre = genre.id
                    break
                  }
                }
                if (data.genre) break
              }
            }
          } catch (error) {
            console.warn('Error fetching event genres:', error)
          }
        }

        // Auto-assigner l'affiche d'impro si le genre est "impro" et pas d'affiche définie
        if (data.genre && !data.image) {
          try {
            // Récupérer le genre assigné pour vérifier s'il s'agit d'impro
            const assignedGenre = await req.payload.findByID({
              collection: 'event-genres',
              id: data.genre,
            })

            if (assignedGenre && assignedGenre.slug === 'impro') {
              // Chercher l'affiche d'impro par nom de fichier
              const improPosters = await req.payload.find({
                collection: 'media',
                where: {
                  filename: {
                    equals: 'underdog-letter.png',
                  },
                },
                limit: 1,
              })

              if (improPosters.docs.length > 0) {
                data.image = improPosters.docs[0].id
                console.log(`Affiche d'impro assignée automatiquement: ${improPosters.docs[0].filename}`)
              }
            }
          } catch (error) {
            console.warn('Error assigning impro poster:', error)
          }
        }

        return data
      },
    ],
  },
}