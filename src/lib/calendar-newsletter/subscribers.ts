import type { BasePayload } from 'payload'

export const getSubscriberEmails = async (payload: BasePayload) => {
  const emails = new Set<string>()
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'calendar-subscribers',
      limit: 200,
      overrideAccess: true,
      page,
      sort: 'email',
    })

    for (const doc of result.docs) {
      if (doc.email) {
        emails.add(doc.email.toLowerCase())
      }
    }

    hasNextPage = page < result.totalPages
    page += 1
  }

  return Array.from(emails)
}
