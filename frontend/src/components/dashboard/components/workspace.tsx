import { Patient } from 'aidbox-sdk/aidbox-types'

import {
  AllergiesIntoleranceCard,
  ImmunizationsCard,
  AppointmentsCard,
  ConditionsCard,
  ClinicalVitals,
  ObservationsCard
} from './index'

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
        <div style={{ display: 'grid', gridColumnGap: '3rem', gridRowGap: '2rem', gridTemplateColumns: 'repeat(3, 1fr)', padding: '0 3rem' }}>
          <ConditionsCard />
          <AppointmentsCard />
          <ObservationsCard />
          <AllergiesIntoleranceCard />
          <ImmunizationsCard />
        </div>
        <div style={{ padding: '0 3rem' }}>
          <ClinicalVitals />
        </div>
      </div>
    </>

  )
}
