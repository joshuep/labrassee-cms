'use client'

import React, { useState } from 'react'
import { useFormFields } from '@payloadcms/ui/forms/Form'
import { Button } from '@payloadcms/ui/elements/Button'

const ImportFacebookEvents = () => {
  const [loading, setLoading] = useState(false)
  const [importStatus, setImportStatus] = useState(null)
  
  const fields = useFormFields(([fields]) => fields)
  const accessToken = fields?.accessToken?.value
  const pageId = fields?.pageId?.value

  const handleImport = async () => {
    if (!accessToken || !pageId) {
      setImportStatus({
        success: false,
        message: 'Veuillez remplir le token d\'accès et l\'ID de la page Facebook',
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
        
        // Rafraîchir la date de dernière importation
        if (fields?.lastImport?.setValue) {
          fields.lastImport.setValue(new Date().toISOString())
        }
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
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ marginTop: 0 }}>Import des événements Facebook</h3>
        
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Cliquez sur le bouton ci-dessous pour importer les prochains événements depuis votre page Facebook.
          Les événements déjà importés seront ignorés.
        </p>

        <Button
          onClick={handleImport}
          disabled={loading || !accessToken || !pageId}
          buttonStyle="primary"
        >
          {loading ? 'Import en cours...' : 'Importer les événements'}
        </Button>

        {importStatus && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: importStatus.success ? '#d4edda' : '#f8d7da',
            color: importStatus.success ? '#155724' : '#721c24',
            border: `1px solid ${importStatus.success ? '#c3e6cb' : '#f5c6cb'}`,
          }}>
            {importStatus.message}
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <strong>Note:</strong> L&apos;import récupère uniquement les événements futurs. 
          Les événements passés ne sont pas importés.
        </div>
      </div>
    </div>
  )
}

export default ImportFacebookEvents