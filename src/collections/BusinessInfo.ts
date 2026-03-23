import { GlobalConfig } from 'payload'

export const BusinessInfo: GlobalConfig = {
  slug: 'business-info',
  label: 'Informations du café',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'La Brassée',
      admin: {
        description: 'Nom du café',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'COMPTOIR BROUANDERIE',
      admin: {
        description: 'Slogan principal',
      },
    },
    {
      name: 'slogan',
      type: 'text',
      required: true,
      defaultValue: 'BIENVENUE CHEZ TOI!',
      admin: {
        description: 'Message d\'accueil',
      },
    },
    {
      type: 'group',
      name: 'address',
      label: 'Adresse',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
          defaultValue: '2522 RUE BEAUBIEN EST',
          admin: {
            description: 'Adresse de rue',
          },
        },
        {
          name: 'neighborhood',
          type: 'text',
          required: true,
          defaultValue: 'ROSEPATRIE, MTL',
          admin: {
            description: 'Quartier et ville',
          },
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          admin: {
            description: 'Lien Google Maps',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'social',
      label: 'Réseaux sociaux',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Lien Facebook',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Lien Instagram',
          },
        },
        {
          name: 'onlyfans',
          type: 'text',
          admin: {
            description: 'Lien OnlyFans (optionnel)',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'contact',
      label: 'Contact',
      fields: [
        {
          name: 'general',
          type: 'email',
          required: true,
          defaultValue: 'envrac@labrassee.com',
          admin: {
            description: 'Email général',
          },
        },
        {
          name: 'artists',
          type: 'text',
          defaultValue: 'Messenger FB La Brassée',
          admin: {
            description: 'Contact pour les artistes',
          },
        },
        {
          name: 'exhibitions',
          type: 'text',
          defaultValue: 'Messenger FB La Brassée',
          admin: {
            description: 'Contact pour les expositions',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'hours',
      label: 'Horaires',
      fields: [
        {
          type: 'group',
          name: 'lundiMercredi',
          label: 'Lundi-Mercredi',
          fields: [
            {
              name: 'open',
              type: 'text',
              required: true,
              defaultValue: '7H30',
              admin: {
                description: 'Heure d\'ouverture',
              },
            },
            {
              name: 'close',
              type: 'text',
              required: true,
              defaultValue: '21H30',
              admin: {
                description: 'Heure de fermeture',
              },
            },
          ],
        },
        {
          type: 'group',
          name: 'jeudiSamedi',
          label: 'Jeudi-Samedi',
          fields: [
            {
              name: 'open',
              type: 'text',
              required: true,
              defaultValue: '7H30',
              admin: {
                description: 'Heure d\'ouverture',
              },
            },
            {
              name: 'close',
              type: 'text',
              required: true,
              defaultValue: '21H30',
              admin: {
                description: 'Heure de fermeture',
              },
            },
          ],
        },
        {
          type: 'group',
          name: 'dimanche',
          label: 'Dimanche',
          fields: [
            {
              name: 'open',
              type: 'text',
              required: true,
              defaultValue: '7H30',
              admin: {
                description: 'Heure d\'ouverture',
              },
            },
            {
              name: 'close',
              type: 'text',
              required: true,
              defaultValue: '21H30',
              admin: {
                description: 'Heure de fermeture',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      defaultValue: 'CHERCHE PAS NOTRE NUMÉRO DE TÉLÉPHONE. ON PRÉFÈRE TE RÉPONDRE SUR LES RÉSEAUX SOCIAUX!',
      admin: {
        description: 'Message personnalisé pour les clients',
        rows: 3,
      },
    },
  ],
}
