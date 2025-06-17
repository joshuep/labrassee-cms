import { GlobalConfig } from 'payload'

export const FacebookConfig: GlobalConfig = {
  slug: 'facebook-config',
  label: 'Configuration Facebook',
  access: {
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'accessToken',
      type: 'text',
      label: 'Token d\'accès Facebook',
      required: true,
      admin: {
        description: 'Obtenir sur: https://developers.facebook.com/tools/explorer/',
      },
    },
    {
      name: 'pageId',
      type: 'text',
      label: 'ID de la page Facebook',
      required: true,
      admin: {
        description: 'Format: nombre (ex: 123456789012345)',
      },
    },
    {
      name: 'posterRules',
      type: 'array',
      label: 'Règles d\'attribution d\'affiches',
      admin: {
        description: 'Définir quelles affiches utiliser selon les genres ou mots-clés des événements',
      },
      fields: [
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Affiche à utiliser',
          admin: {
            description: 'L\'affiche qui sera automatiquement assignée',
          },
        },
        {
          name: 'genre',
          type: 'relationship',
          relationTo: 'event-genres',
          label: 'Genre (optionnel)',
          admin: {
            description: 'Si spécifié, cette affiche sera utilisée pour tous les événements de ce genre',
          },
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Mots-clés (optionnel)',
          admin: {
            description: 'Si spécifiés, cette affiche sera utilisée pour les événements contenant ces mots-clés dans le titre',
          },
          fields: [
            {
              name: 'keyword',
              type: 'text',
              required: true,
              label: 'Mot-clé',
            },
          ],
        },
        {
          name: 'priority',
          type: 'number',
          label: 'Priorité',
          defaultValue: 1,
          admin: {
            description: 'Ordre de priorité (1 = plus haute priorité). En cas de conflit, la règle avec la priorité la plus élevée sera utilisée.',
          },
        },
      ],
    },
    {
      name: 'lastImport',
      type: 'date',
      label: 'Dernière importation',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'importButton',
      type: 'ui',
      admin: {
        components: {
          Field: '../admin/components/ImportFacebookEvents.js',
        },
      },
    },
  ],
}