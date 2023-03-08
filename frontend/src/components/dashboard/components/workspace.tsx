import { Patient } from 'aidbox-sdk/aidbox-types'

import { AppointmentsCard } from './appointments-card'
import { Conditions } from './conditions'
import { Observations } from './observation'

interface Props {
  patient?: Patient
}

export function Workspace ({ patient }: Props) {
  return (
    <>
      <h3 style={{ padding: '2rem 3rem', fontSize: '1.8rem' }}>
        Welcome, {patient?.name?.[0]?.given?.[0]}
      </h3>

      <div style={{ flexDirection: 'column', gap: '1rem', display: 'flex' }}>
        <div style={{ display: 'grid', justifySelf: 'self-end', padding: '0 3rem', gridColumnGap: '3rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <Conditions />
          <AppointmentsCard />
          <Observations />
        </div>
      </div>
    </>

  )
}
