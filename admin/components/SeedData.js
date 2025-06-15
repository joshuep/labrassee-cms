'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'

const SeedData = () => {
  const [loading, setLoading] = useState(false)
  const [seedStatus, setSeedStatus] = useState(null)

  const handleSeedGenres = async () => {
    setLoading(true)
    setSeedStatus(null)

    try {
      const response = await fetch('/api/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event-genres',
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSeedStatus({
          success: true,
          message: `Seed réussi ! ${result.created} genres créés, ${result.skipped} ignorés.`,
        })
      } else {
        setSeedStatus({
          success: false,
          message: result.error || 'Erreur lors du seed',
        })
      }
    } catch (error) {
      console.error('Seed error:', error)
      setSeedStatus({
        success: false,
        message: 'Erreur de connexion au serveur',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeedMenuItems = async () => {
    setLoading(true)
    setSeedStatus(null)

    try {
      const response = await fetch('/api/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'menu-items',
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSeedStatus({
          success: true,
          message: `Seed réussi ! ${result.created} pages de menu créées, ${result.skipped} ignorées.`,
        })
      } else {
        setSeedStatus({
          success: false,
          message: result.error || 'Erreur lors du seed',
        })
      }
    } catch (error) {
      console.error('Seed error:', error)
      setSeedStatus({
        success: false,
        message: 'Erreur de connexion au serveur',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeedAll = async () => {
    setLoading(true)
    setSeedStatus(null)

    try {
      const response = await fetch('/api/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'all',
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSeedStatus({
          success: true,
          message: `Seed complet réussi ! ${result.totalCreated} éléments créés au total.`,
        })
      } else {
        setSeedStatus({
          success: false,
          message: result.error || 'Erreur lors du seed complet',
        })
      }
    } catch (error) {
      console.error('Seed error:', error)
      setSeedStatus({
        success: false,
        message: 'Erreur de connexion au serveur',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <div style={{ 
        backgroundColor: 'var(--theme-bg, #fafafa)', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid var(--theme-border-color, #e1e1e1)',
        color: 'var(--theme-text, #333333)'
      }}>
        <h3 style={{ 
          marginTop: 0,
          marginBottom: '16px',
          color: 'var(--theme-text, #333333)',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Initialisation des données par défaut
        </h3>
        
        <p style={{ 
          marginBottom: '20px', 
          color: 'var(--theme-text-light, #666666)',
          lineHeight: '1.5'
        }}>
          Utilisez ces boutons pour créer les données de base nécessaires au bon fonctionnement du CMS.
          Les données existantes ne seront pas écrasées.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap',
          marginBottom: '20px' 
        }}>
          <Button
            onClick={handleSeedGenres}
            disabled={loading}
            buttonStyle="secondary"
            style={{
              backgroundColor: loading ? '#ccc' : '#28a745',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? '⏳ Création...' : '🎭 Créer les genres d\'événements'}
          </Button>

          <Button
            onClick={handleSeedMenuItems}
            disabled={loading}
            buttonStyle="secondary"
            style={{
              backgroundColor: loading ? '#ccc' : '#fd7e14',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? '⏳ Création...' : '📄 Créer les pages de menu'}
          </Button>

          <Button
            onClick={handleSeedAll}
            disabled={loading}
            buttonStyle="primary"
            style={{
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? '⏳ Initialisation...' : '🚀 Initialiser toutes les données'}
          </Button>
        </div>

        {seedStatus && (
          <div style={{
            marginTop: '15px',
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: seedStatus.success 
              ? 'var(--theme-success-bg, #d4edda)' 
              : 'var(--theme-error-bg, #f8d7da)',
            color: seedStatus.success 
              ? 'var(--theme-success-text, #155724)' 
              : 'var(--theme-error-text, #721c24)',
            border: `1px solid ${seedStatus.success 
              ? 'var(--theme-success-border, #c3e6cb)' 
              : 'var(--theme-error-border, #f5c6cb)'}`,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {seedStatus.success ? '✅ ' : '❌ '}
            {seedStatus.message}
          </div>
        )}

        <div style={{ 
          marginTop: '20px', 
          fontSize: '13px', 
          color: 'var(--theme-text-light, #888888)',
          lineHeight: '1.4',
          fontStyle: 'italic'
        }}>
          💡 <strong>Note :</strong> Ces opérations créent uniquement les données manquantes. 
          Les données existantes ne sont jamais modifiées ou supprimées.
        </div>
      </div>
    </div>
  )
}

export default SeedData