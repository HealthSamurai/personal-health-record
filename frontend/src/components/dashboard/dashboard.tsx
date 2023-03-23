import { Patient } from 'aidbox-sdk/aidbox-types'
import { useEffect, useState } from 'react'

import { aidboxClient } from '../../utils/aidbox-client'
import { Layout } from '../layout'

import { Workspace } from './components/workspace'

export function Dashboard () {
  const [patient, setPatient] = useState<Patient>()

  const searchParams = new URLSearchParams(document.location.search)
  const patient_id = searchParams.get('id')

  useEffect(() => {
    if (!patient_id) {
      return
    }

    aidboxClient.getResource('Patient', patient_id).then((response) => {
      if ((response instanceof Error)) return

      setPatient(response)
    })
  }, [patient_id])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Layout patient={patient} />
      <div style={{ padding: '2rem 0', background: '#FAFBFD', width: 'calc(100% - 300px)' }}>
        <Workspace patient={patient} />
      </div>
    </div>
  )
}
