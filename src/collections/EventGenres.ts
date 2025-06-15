import { CollectionConfig } from 'payload'

export const EventGenres: CollectionConfig = {
  slug: 'event-genres',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'symbol'],
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
        description: 'Nom du genre d\'événement',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identifiant unique du genre (utilisé dans l\'URL)',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Icône SVG représentant ce genre',
      },
      filterOptions: {
        mimeType: {
          contains: 'svg',
        },
      },
    },
    {
      name: 'keywords',
      type: 'array',
      required: true,
      admin: {
        description: 'Mots-clés utilisés pour identifier automatiquement ce genre dans les titres d\'événements',
      },
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
          admin: {
            description: 'Mot ou phrase à rechercher dans le titre (insensible à la casse)',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description du genre (optionnel)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-générer le slug si pas fourni
        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }

        return data
      },
    ],
  },
}