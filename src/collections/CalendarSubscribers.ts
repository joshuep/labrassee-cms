import type { CollectionConfig } from 'payload'

export const CalendarSubscribers: CollectionConfig = {
  slug: 'calendar-subscribers',
  admin: {
    defaultColumns: ['email', 'createdAt'],
    group: 'Marketing',
    useAsTitle: 'email',
  },
  access: {
    create: () => true,
    delete: ({ req: { user } }) => !!user,
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email && typeof data.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }
        return data
      },
    ],
  },
}
