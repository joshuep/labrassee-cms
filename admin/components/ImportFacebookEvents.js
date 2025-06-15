'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui/elements/Button'

const ImportFacebookEvents = () => {
  const [loading, setLoading] = useState(false)
  const [importStatus, setImportStatus] = useState(null)

  const handleImport = async () => {
    // Récupérer les valeurs directement depuis les inputs du formulaire
    const accessTokenInput = document.querySelector('input[name="accessToken"]')
    const pageIdInput = document.querySelector('input[name="pageId"]')
    
    const accessToken = accessTokenInput?.value
    const pageId = pageIdInput?.value
    
    if (!accessToken || !pageId) {
      setImportStatus({
        success: false,
        message: 'Veuillez remplir le token d\'accès et l\'ID de la page Facebook avant de lancer l\'import',
      })
      return
    }

    setLoading(true)
    setImportStatus(null)

    try {
      const response = await fetch('/api/import-facebook-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          pageId,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setImportStatus({
          success: true,
          message: `Import réussi ! ${result.imported} événements importés, ${result.skipped} ignorés, ${result.errors || 0} erreurs.`,
        })
        
        // Rafraîchir la page pour voir les nouveaux événements
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setImportStatus({
          success: false,
          message: result.error || 'Erreur lors de l\'import',
        })
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportStatus({
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
          Import des événements Facebook
        </h3>
        
        <p style={{ 
          marginBottom: '20px', 
          color: 'var(--theme-text-light, #666666)',
          lineHeight: '1.5'
        }}>
          Cliquez sur le bouton ci-dessous pour importer les prochains événements depuis votre page Facebook.
          Les événements déjà importés seront ignorés.
        </p>

        <Button
          onClick={handleImport}
          disabled={loading}
          buttonStyle="primary"
          style={{
            backgroundColor: loading ? '#ccc' : '#0066cc',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          {loading ? '⏳ Import en cours...' : '📥 Importer les événements'}
        </Button>

        {importStatus && (
          <div style={{
            marginTop: '15px',
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor: importStatus.success 
              ? 'var(--theme-success-bg, #d4edda)' 
              : 'var(--theme-error-bg, #f8d7da)',
            color: importStatus.success 
              ? 'var(--theme-success-text, #155724)' 
              : 'var(--theme-error-text, #721c24)',
            border: `1px solid ${importStatus.success 
              ? 'var(--theme-success-border, #c3e6cb)' 
              : 'var(--theme-error-border, #f5c6cb)'}`,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {importStatus.success ? '✅ ' : '❌ '}
            {importStatus.message}
          </div>
        )}

        <div style={{ 
          marginTop: '20px', 
          fontSize: '13px', 
          color: 'var(--theme-text-light, #888888)',
          lineHeight: '1.4',
          fontStyle: 'italic'
        }}>
          💡 <strong>Note :</strong> L'import récupère uniquement les événements futurs. 
          Les événements passés ne sont pas importés.
        </div>
      </div>
    </div>
  )
}

export default ImportFacebookEvents