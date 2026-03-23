export type CalendarDisplayMode = 'custom' | 'month'

export type CalendarNewsletterSettings = {
  defaultSubject?: string | null
  fromEmail?: string | null
  fromName?: string | null
  googleCalendarId?: string | null
  googleClientId?: string | null
  googleClientSecret?: string | null
  googleConnectedEmail?: string | null
  googleRefreshTokenEncrypted?: string | null
  introMessage?: string | null
  replyToEmail?: string | null
}

export type NewsletterOverrides = {
  displayMode?: CalendarDisplayMode
  defaultSubject?: string
  fromEmail?: string
  fromName?: string
  googleCalendarId?: string
  googleClientId?: string
  googleClientSecret?: string
  introMessage?: string
  replyToEmail?: string
  selectedMonth?: string
}

export type NormalizedCalendarEvent = {
  compactTitle?: string
  dayKey: string
  htmlLink?: string | null
  isAllDay: boolean
  location?: string | null
  sortValue: string
  startDisplayTime: string
  title: string
}

export type CalendarWeekEvent = {
  event: NormalizedCalendarEvent
  isoDate: string
  weekdayDayNumber: string
  weekdayName: string
  weekdayLabel: string
}

export type CalendarWeekSection = {
  events: CalendarWeekEvent[]
  label: string
}

export type BuildEmailWeeksInput = {
  displayMode?: CalendarDisplayMode
  events: NormalizedCalendarEvent[]
  rangeEnd: string
  rangeStart: string
  selectedMonth?: string
}

export type RenderCalendarEmailInput = {
  addressLine1?: string | null
  addressLine2?: string | null
  businessName: string
  introMessage?: string | null
  periodLabel?: string
  rangeEnd: string
  rangeStart: string
  siteURL: string
  subject: string
  tagline?: string | null
  weeks: CalendarWeekSection[]
}
