// storage-adapter-import-placeholder
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Events } from './collections/Events'
import { EventGenres } from './collections/EventGenres'
import { MenuItems } from './collections/MenuItems'
import { CalendarSubscribers } from './collections/CalendarSubscribers'
import { BusinessInfo } from './collections/BusinessInfo'
import { FacebookConfig } from './collections/FacebookConfig'
import { SystemConfig } from './collections/SystemConfig'
import { CalendarNewsletter } from './globals/CalendarNewsletter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- La Brassée CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
  cors: process.env.NODE_ENV === 'development' 
    ? '*' 
    : [
        'http://localhost:5173',
        'http://localhost:5174', 
        'http://localhost:3000',
        'http://localhost:4173',
        process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001',
        'https://labrassee.cafe',
        'https://www.labrassee.cafe',
        'https://jolly-chebyshev.74-208-77-27.plesk.page',
        'http://jolly-chebyshev.74-208-77-27.plesk.page',
        'https://labrassee-cms-426g.vercel.app',
        // Accepter toutes les URLs de preview Vercel
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
        ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : [])
      ].filter(Boolean),
  collections: [Users, Media, Events, EventGenres, MenuItems, CalendarSubscribers],
  globals: [BusinessInfo, FacebookConfig, SystemConfig, CalendarNewsletter],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
