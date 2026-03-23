import { GlobalConfig } from 'payload'

const defaultRedirectURI =
  `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'}/api/calendar-newsletter/google/callback`

export const CalendarNewsletter: GlobalConfig = {
  slug: 'calendar-newsletter',
  label: 'Infolettre calendrier',
  admin: {
    group: 'Marketing',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'googleClientId',
      type: 'text',
      label: 'Google OAuth Client ID',
      required: true,
      admin: {
        description:
          'Créer un client OAuth Web dans Google Cloud Console, puis autoriser cette URL de redirection: ' +
          defaultRedirectURI,
      },
    },
    {
      name: 'googleClientSecret',
      type: 'text',
      label: 'Google OAuth Client Secret',
      required: true,
      admin: {
        description:
          'Enregistrer la globale, puis cliquer sur le bouton de connexion plus bas pour autoriser Google Calendar.',
      },
    },
    {
      name: 'googleCalendarId',
      type: 'text',
      label: 'ID du calendrier Google',
      required: true,
      admin: {
        description:
          'Obligatoire si le calendrier n’est pas le principal. Exemple: abc123@group.calendar.google.com',
      },
    },
    {
      name: 'googleConnectedEmail',
      type: 'text',
      label: 'Compte Google connecté',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'googleTokenUpdatedAt',
      type: 'date',
      label: 'Connexion Google mise à jour',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'googleRefreshTokenEncrypted',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'fromName',
      type: 'text',
      label: 'Nom expéditeur',
      required: true,
      defaultValue: 'La Brassée',
    },
    {
      name: 'fromEmail',
      type: 'email',
      label: 'Courriel expéditeur',
      required: true,
      admin: {
        description:
          'Doit être une adresse expéditrice vérifiée chez Resend. La clé API Resend reste en variable d’environnement.',
      },
    },
    {
      name: 'replyToEmail',
      type: 'email',
      label: 'Répondre à',
    },
    {
      name: 'defaultSubject',
      type: 'text',
      label: 'Sujet du courriel',
      required: true,
      defaultValue: 'La programmation de La Brassée',
    },
    {
      name: 'introMessage',
      type: 'textarea',
      label: 'Message avant le calendrier',
      admin: {
        rows: 5,
      },
    },
    {
      name: 'newsletterManager',
      type: 'ui',
      admin: {
        components: {
          Field: '../admin/components/CalendarNewsletterManager.js',
        },
      },
    },
    {
      name: 'lastTestSentAt',
      type: 'date',
      label: 'Dernier courriel test',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'lastCampaignSentAt',
      type: 'date',
      label: 'Dernier envoi abonnés',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
    {
      name: 'lastCampaignRecipientCount',
      type: 'number',
      label: 'Nombre de destinataires du dernier envoi',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastCampaignRangeStart',
      type: 'date',
      label: 'Début de la dernière plage envoyée',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
    {
      name: 'lastCampaignRangeEnd',
      type: 'date',
      label: 'Fin de la dernière plage envoyée',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
    },
  ],
}
