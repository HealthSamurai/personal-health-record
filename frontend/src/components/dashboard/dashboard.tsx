import { Patient } from 'aidbox-sdk/aidbox-types'
import { useEffect, useState } from 'react'

import { client } from '../../utils/aidbox-client'
import { Layout } from '../layout'

import { Workspace } from './components'

export function Dashboard () {
  let [patient, setPatient] = useState<Patient>()

  let searchParams = new URLSearchParams(document.location.search)
  let patient_id = searchParams.get('id')

  useEffect(() => {
    if (!patient_id) {
      return
    }

    client.getResource('Patient', patient_id).then((response) => {
      if ((response instanceof Error)) return

      setPatient(response)
    })
  }, [patient_id])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Layout patient={patient} />
      <div style={{ padding: '2rem 0', background: '#FAFBFD', width: '100%' }}>
        <Workspace patient={patient} />
      </div>
    </div>
  )
}