import { GlobalConfig } from 'payload'

export const SystemConfig: GlobalConfig = {
  slug: 'system-config',
  label: 'Configuration système',
  admin: {
    group: 'Administration',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'seedSection',
      type: 'ui',
      admin: {
        components: {
          Field: '../admin/components/SeedData.js',
        },
      },
    },
    {
      name: 'lastSeed',
      type: 'date',
      label: 'Dernier seed effectué',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      type: 'group',
      name: 'stats',
      label: 'Statistiques',
      admin: {
        description: 'Informations sur le contenu du CMS',
      },
      fields: [
        {
          name: 'totalEvents',
          type: 'number',
          label: 'Nombre total d\'événements',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalGenres',
          type: 'number',
          label: 'Nombre de genres d\'événements',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'totalMedia',
          type: 'number',
          label: 'Nombre de fichiers médias',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
}