'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useAuth, useFormFields } from '@payloadcms/ui'

const panelStyle = {
  background: '#f7f5ee',
  border: '1px solid #ddd5c4',
  borderRadius: '12px',
  margin: '20px 0',
  padding: '24px',
}

const sectionTitleStyle = {
  color: '#16120c',
  fontFamily: '"DIN Condensed", "Arial Narrow", Arial, sans-serif',
  fontSize: '28px',
  letterSpacing: '0.04em',
  margin: '0 0 8px 0',
  textTransform: 'uppercase',
}

const smallLabelStyle = {
  color: '#6d634c',
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  marginBottom: '6px',
  textTransform: 'uppercase',
}

const inputStyle = {
  border: '1px solid #cdbf9b',
  borderRadius: '10px',
  boxSizing: 'border-box',
  fontSize: '14px',
  minHeight: '44px',
  padding: '10px 12px',
  width: '100%',
}

const buttonBaseStyle = {
  appearance: 'none',
  border: 'none',
  borderRadius: '999px',
  cursor: 'pointer',
  fontFamily: '"DIN Condensed", "Arial Narrow", Arial, sans-serif',
  fontSize: '17px',
  letterSpacing: '0.06em',
  minHeight: '44px',
  padding: '0 18px',
  textTransform: 'uppercase',
}

const primaryButtonStyle = {
  ...buttonBaseStyle,
  background: '#16120c',
  color: '#f7d135',
}

const secondaryButtonStyle = {
  ...buttonBaseStyle,
  background: '#f7d135',
  color: '#16120c',
}

const subtleButtonStyle = {
  ...buttonBaseStyle,
  background: '#ede4c3',
  color: '#5f4a00',
}

const getFieldValue = (fields, key) => fields?.[key]?.value

const getDefaultMonthValue = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const getMonthLabel = (value) => {
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('fr-CA', {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(/^\w/, (letter) => letter.toUpperCase())
}

const getMonthLastDay = (value) => {
  const [year, month] = value.split('-').map(Number)
  return `${year}-${String(month).padStart(2, '0')}-${String(new Date(Date.UTC(year, month, 0)).getUTCDate()).padStart(2, '0')}`
}

const getMonthEnvelope = (value) => {
  const [year, month] = value.split('-').map(Number)
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 0))
  const mondayIndex = (monthStart.getUTCDay() + 6) % 7
  const sundayIndex = (monthEnd.getUTCDay() + 6) % 7
  const gridStart = new Date(monthStart)
  const gridEnd = new Date(monthEnd)

  gridStart.setUTCDate(gridStart.getUTCDate() - mondayIndex)
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - sundayIndex))

  return {
    rangeEnd: `${gridEnd.getUTCFullYear()}-${String(gridEnd.getUTCMonth() + 1).padStart(2, '0')}-${String(gridEnd.getUTCDate()).padStart(2, '0')}`,
    rangeStart: `${gridStart.getUTCFullYear()}-${String(gridStart.getUTCMonth() + 1).padStart(2, '0')}-${String(gridStart.getUTCDate()).padStart(2, '0')}`,
  }
}

const buildMonthOptions = () => {
  const options = []
  const now = new Date()

  for (let offset = 0; offset < 18; offset += 1) {
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() + offset, 1))
    const value = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    options.push({
      label: getMonthLabel(value),
      value,
    })
  }

  return options
}

const CalendarNewsletterManager = () => {
  const { user } = useAuth()
  const fields = useFormFields(([allFields]) => allFields)
  const [sendMode, setSendMode] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonthValue())
  const [rangeStart, setRangeStart] = useState(`${getDefaultMonthValue()}-01`)
  const [rangeEnd, setRangeEnd] = useState(getMonthLastDay(getDefaultMonthValue()))
  const [testEmail, setTestEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [isSendingLive, setIsSendingLive] = useState(false)
  const monthOptions = useMemo(() => buildMonthOptions(), [])
  const googleConnectedEmail = getFieldValue(fields, 'googleConnectedEmail')
  const googleCalendarId = getFieldValue(fields, 'googleCalendarId')
  const googleClientId = getFieldValue(fields, 'googleClientId')
  const googleClientSecret = getFieldValue(fields, 'googleClientSecret')
  const currentSubject = getFieldValue(fields, 'defaultSubject') || ''
  const currentIntroMessage = getFieldValue(fields, 'introMessage') || ''
  const activePeriod = sendMode === 'month' ? getMonthEnvelope(selectedMonth) : { rangeEnd, rangeStart }

  useEffect(() => {
    if (!testEmail && user?.email) {
      setTestEmail(user.email)
    }
  }, [testEmail, user?.email])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauth = params.get('oauth')
    const reason = params.get('reason')

    if (!oauth) return

    setStatus({
      kind: oauth === 'success' ? 'success' : 'error',
      message: oauth === 'success' ? 'Connexion Google réussie.' : reason || 'Connexion Google impossible.',
    })

    params.delete('oauth')
    params.delete('reason')
    const nextQuery = params.toString()
    const nextURL = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', nextURL)
  }, [])

  const payloadForSend = () => {
    return {
      defaultSubject: currentSubject,
      displayMode: sendMode,
      fromEmail: getFieldValue(fields, 'fromEmail') || '',
      fromName: getFieldValue(fields, 'fromName') || '',
      googleCalendarId: getFieldValue(fields, 'googleCalendarId') || '',
      googleClientId: getFieldValue(fields, 'googleClientId') || '',
      googleClientSecret: getFieldValue(fields, 'googleClientSecret') || '',
      introMessage: currentIntroMessage,
      rangeEnd: activePeriod.rangeEnd,
      rangeStart: activePeriod.rangeStart,
      replyToEmail: getFieldValue(fields, 'replyToEmail') || '',
      selectedMonth: sendMode === 'month' ? selectedMonth : '',
    }
  }

  const setSuccessStatus = (message) => {
    setStatus({ kind: 'success', message })
  }

  const setErrorStatus = (message) => {
    setStatus({ kind: 'error', message })
  }

  const handleGoogleConnect = () => {
    if (!googleClientId || !googleClientSecret || !googleCalendarId) {
      setErrorStatus('Renseigne puis enregistre le client ID, le client secret et l’ID du calendrier avant la connexion.')
      return
    }

    window.location.assign(`/api/calendar-newsletter/google/connect?returnTo=${encodeURIComponent(window.location.pathname)}`)
  }

  const handleSendTest = async () => {
    const payload = {
      ...payloadForSend(),
      testEmail,
    }

    if (!payload.rangeStart || !payload.rangeEnd || payload.rangeEnd < payload.rangeStart) {
      setErrorStatus('Choisis une plage valide pour le test.')
      return
    }

    setIsSendingTest(true)
    setStatus(null)

    try {
      const response = await fetch('/api/calendar-newsletter/send-test', {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Envoi du test impossible.')
      }

      fields?.lastTestSentAt?.setValue?.(new Date().toISOString())
      setSuccessStatus(result.message)
    } catch (error) {
      setErrorStatus(error instanceof Error ? error.message : 'Envoi du test impossible.')
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleSendLive = async () => {
    const payload = payloadForSend()

    if (!payload.rangeStart || !payload.rangeEnd || payload.rangeEnd < payload.rangeStart) {
      setErrorStatus('Choisis une plage valide avant l’envoi aux abonnés.')
      return
    }

    const isConfirmed = window.confirm(
      `Envoyer cette infolettre à tous les abonnés pour la grille du ${payload.rangeStart} au ${payload.rangeEnd} ?`,
    )

    if (!isConfirmed) return

    setIsSendingLive(true)
    setStatus(null)

    try {
      const response = await fetch('/api/calendar-newsletter/send-live', {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Envoi aux abonnés impossible.')
      }

      const now = new Date().toISOString()
      fields?.lastCampaignSentAt?.setValue?.(now)
      fields?.lastCampaignRecipientCount?.setValue?.(result.recipientsCount)
      fields?.lastCampaignRangeStart?.setValue?.(payload.rangeStart)
      fields?.lastCampaignRangeEnd?.setValue?.(payload.rangeEnd)
      setSuccessStatus(result.message)
    } catch (error) {
      setErrorStatus(error instanceof Error ? error.message : 'Envoi aux abonnés impossible.')
    } finally {
      setIsSendingLive(false)
    }
  }

  return (
    <div style={panelStyle}>
      <h3 style={sectionTitleStyle}>Pilotage de l’infolettre calendrier</h3>
      <p style={{ color: '#4f4638', margin: '0 0 20px 0' }}>
        Les boutons utilisent les valeurs visibles dans le formulaire. Enregistre la globale si tu veux conserver
        définitivement le sujet, le message ou l’expéditeur.
      </p>

      <div
        style={{
          alignItems: 'center',
          background: googleConnectedEmail ? '#eef8ee' : '#fff7ea',
          border: `1px solid ${googleConnectedEmail ? '#bfe1bf' : '#ead9ad'}`,
          borderRadius: '12px',
          display: 'flex',
          gap: '14px',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '16px',
        }}
      >
        <div>
          <div style={smallLabelStyle}>Connexion Google</div>
          <div style={{ color: '#16120c', fontSize: '15px', marginBottom: '4px' }}>
            {googleConnectedEmail
              ? `Connecté avec ${googleConnectedEmail}`
              : 'Aucune connexion Google active pour l’instant.'}
          </div>
          <div style={{ color: '#6d634c', fontSize: '13px' }}>
            L’ID de calendrier configuré est: <strong>{googleCalendarId || 'non défini'}</strong>
          </div>
        </div>

        <button onClick={handleGoogleConnect} style={secondaryButtonStyle} type="button">
          {googleConnectedEmail ? 'Reconnecter Google' : 'Connecter Google'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={smallLabelStyle}>Mode de période</div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button
            onClick={() => setSendMode('month')}
            style={sendMode === 'month' ? secondaryButtonStyle : subtleButtonStyle}
            type="button"
          >
            Choisir un mois
          </button>
          <button
            onClick={() => setSendMode('custom')}
            style={sendMode === 'custom' ? secondaryButtonStyle : subtleButtonStyle}
            type="button"
          >
            Plage personnalisée
          </button>
        </div>

        {sendMode === 'month' ? (
          <div>
            <label style={smallLabelStyle}>Mois</label>
            <select
              onChange={(event) => setSelectedMonth(event.target.value)}
              style={inputStyle}
              value={selectedMonth}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '12px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            <div>
              <label style={smallLabelStyle}>Début</label>
              <input
                onChange={(event) => setRangeStart(event.target.value)}
                style={inputStyle}
                type="date"
                value={rangeStart}
              />
            </div>
            <div>
              <label style={smallLabelStyle}>Fin</label>
              <input
                onChange={(event) => setRangeEnd(event.target.value)}
                style={inputStyle}
                type="date"
                value={rangeEnd}
              />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: '#fffdf8',
          border: '1px solid #e6deca',
          borderRadius: '12px',
          marginBottom: '20px',
          padding: '16px',
        }}
      >
        <div style={smallLabelStyle}>Résumé visuel du courriel</div>
        <div style={{ color: '#16120c', fontSize: '14px', marginBottom: '6px' }}>
          Sujet actuel: <strong>{currentSubject || 'Aucun sujet'}</strong>
        </div>
        <div style={{ color: '#16120c', fontSize: '14px', marginBottom: '6px' }}>
          {sendMode === 'month' ? 'Mois éditorial: ' : 'Période choisie: '}
          <strong>
            {sendMode === 'month' ? getMonthLabel(selectedMonth) : `${rangeStart || '...'} au ${rangeEnd || '...'}`}
          </strong>
        </div>
        <div style={{ color: '#16120c', fontSize: '14px', marginBottom: '6px' }}>
          Grille envoyée: <strong>{`${activePeriod.rangeStart} au ${activePeriod.rangeEnd}`}</strong>
        </div>
        <div style={{ color: '#16120c', fontSize: '14px', marginBottom: '6px' }}>
          Message personnalisé:{' '}
          <strong>{currentIntroMessage ? currentIntroMessage.slice(0, 120) : 'Aucun message ajouté.'}</strong>
          {currentIntroMessage && currentIntroMessage.length > 120 ? '...' : ''}
        </div>
        <div style={{ color: '#6d634c', fontSize: '13px' }}>
          Mise en page prévue: une case fixe par jour, heure à droite du numéro, titre principal dans la case, sans heure de fin.
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '12px',
          gridTemplateColumns: 'minmax(220px, 1fr) auto auto',
        }}
      >
        <div>
          <label style={smallLabelStyle}>Courriel test</label>
          <input
            onChange={(event) => setTestEmail(event.target.value)}
            placeholder="personne@exemple.com"
            style={inputStyle}
            type="email"
            value={testEmail}
          />
        </div>

        <div style={{ alignSelf: 'end' }}>
          <button disabled={isSendingTest} onClick={handleSendTest} style={primaryButtonStyle} type="button">
            {isSendingTest ? 'Envoi test...' : 'Envoyer un test'}
          </button>
        </div>

        <div style={{ alignSelf: 'end' }}>
          <button disabled={isSendingLive} onClick={handleSendLive} style={secondaryButtonStyle} type="button">
            {isSendingLive ? 'Envoi en cours...' : 'Envoyer aux abonnés'}
          </button>
        </div>
      </div>

      {status ? (
        <div
          style={{
            background: status.kind === 'success' ? '#eef8ee' : '#fff0f0',
            border: `1px solid ${status.kind === 'success' ? '#bfe1bf' : '#efc5c5'}`,
            borderRadius: '10px',
            color: status.kind === 'success' ? '#265d26' : '#8b2e2e',
            marginTop: '18px',
            padding: '12px 14px',
          }}
        >
          {status.message}
        </div>
      ) : null}
    </div>
  )
}

export default CalendarNewsletterManager
