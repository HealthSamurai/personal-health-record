import { Patient } from 'aidbox-sdk/aidbox-types'

import { Divider } from '../../shared/divider/divider'

import { Contacts } from './contacts'
import { Identifiers } from './identifiers'
import styles from './layout.module.css'
import { PatientInfo } from './patient-info'

interface Props {
  patient?: Patient
}

export function Layout ({ patient }: Props): JSX.Element | null {
  if (!patient) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <p>HS PHR</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <PatientInfo patient={patient} />
        <Divider />
        <Contacts patient={patient} />
        <Divider />
        <Identifiers identifiers={patient.identifier} />
      </div>
    </div>
  )
}
