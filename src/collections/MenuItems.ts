import { CollectionConfig } from 'payload'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'status'],
    group: 'Menu',
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
        description: 'Nom de la catégorie de menu',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identifiant unique pour la catégorie',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image de la catégorie de menu',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: {
        description: 'Ordre d\'affichage (1 = premier)',
        step: 1,
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Description de la catégorie (optionnel)',
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
        description: 'Statut de publication de la catégorie',
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
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
    ],
  },
}