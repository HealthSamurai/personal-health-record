import { Appointment, Practitioner, PractitionerRole } from 'aidbox-sdk/aidbox-types'
import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

import ClockIcon from '../../../assets/clock.svg'
import UserIcon from '../../../assets/user.svg'
import { CardWrapper } from '../../../shared/card'
import { Divider } from '../../../shared/divider/divider'
import { client } from '../../../utils/aidbox-client'
import { transformName } from '../../../utils/transform-name'

import styles from './workspace.module.css'

function formatDate (date: string) {
  if (date.includes('T')) {
    let [year, month, day] = date.split('T')[0].split('-')
    return `${day}/${month}/${year}`
  }

  let [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export function AppointmentsCard () {
  let [nextAppointment, setNextAppointment] = useState<Appointment>()
  let [appointments, setAppointments] = useState<Appointment[]>([])
  let [total, setTotal] = useState<number>(0)
  let [loading, setLoading] = useState(true)
  let searchParams = new URLSearchParams(document.location.search)
  let patient_id = searchParams.get('id')

  let getNextAppointment = useCallback(async () => {
    let response = await client.getResources('Appointment')
      .where('patient', `Patient/${patient_id}`)
      .where('date', new Date().toISOString(), 'gt')
      .sort([{ key: 'date', dir: 'acs' }])

    if (response.entry.length > 0) {
      setNextAppointment(response?.entry[0].resource ?? {})
      setLoading(false)
    }

    return response.entry.length > 0
  }, [patient_id])

  let getAppointments = useCallback(async () => {
    let response = await client.getResources('Appointment')
      .where('patient', `Patient/${patient_id}`)

    if (response.entry.length > 0) {
      setAppointments(response?.entry.map((r) => r.resource))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setTotal(response.total)
      setLoading(false)
    }
  }, [patient_id])

  useEffect(() => {
    getNextAppointment()
      .then((haveNextAppointment) => {
        if (!haveNextAppointment) {
          getAppointments()
        }
      })
  }, [getAppointments, getNextAppointment])

  let nextAppointmentAction = {
    label: 'Manage Appointment',
    onClick: () => ({})
  }

  let appointmentsAction = {
    label: 'Show all',
    onClick: () => ({})
  }

  let bottomAction = nextAppointment ? [nextAppointmentAction, appointmentsAction] : appointmentsAction

  let title = nextAppointment ? 'Next Appointment' : 'Appointments' + (total > 0 ? `(${total})` : '')

  return (
    <CardWrapper
      loading={loading}
      alignCenter={!!nextAppointment}
      empty={!nextAppointment && total === 0}
      title={title}
      bottomActions={bottomAction}
    >
      {nextAppointment ? <NextAppointment appointment={nextAppointment} /> : <Appointments appointments={appointments} />}
    </CardWrapper>
  )
}

interface NextAppointmentProps {
  appointment: Appointment
}
function NextAppointment ({ appointment }: NextAppointmentProps) {
  let [practitionerRole, setPractitionerRole] = useState<PractitionerRole>()
  let [practitioner, setPractitioner] = useState<Practitioner>()

  async function getPractitionerRole (id: string) {
    let response = await client.getResources('PractitionerRole')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
      .where('.practitioner.reference', `Practitioner/${id}`)

    if (response.entry.length > 0) {
      setPractitionerRole(response.entry[0].resource)
    }

    return response.entry.length > 0
  }

  async function getPractitioner (id: string) {
    let practitioner = await client.getResource('Practitioner', id)

    if (!(practitioner instanceof Error)) {
      setPractitioner(practitioner)
    }
  }

  useEffect(() => {
    let practitioner = appointment.participant?.find((p) => p.actor?.resourceType === 'Practitioner')
    let id = practitioner?.actor?.id
    if (id) {
      getPractitionerRole(id)
        .then((practitionerRole) => {
          if (!practitionerRole) {
            getPractitioner(id as string)
          }
        })
    }
  }, [appointment.participant])

  let startDate = format(new Date(appointment.start ?? ''), 'dd MMMM')
  let startTime = appointment.start && format(new Date(appointment.start), 'hh:mm a')
  let endTime = appointment.end && format(new Date(appointment.end), 'hh:mm a')

  let time = startTime
    ? startTime + (endTime ? ' - ' + endTime : '')
    : null

  let practitionerName = practitionerRole?.practitioner?.display ?? transformName(practitioner?.name)

  return (
    <div style={{ padding: '1rem 0.5rem' }}>
      <h4 style={{ fontSize: '2rem' }}>{startDate}</h4>
      <div style={{ display: 'flex', marginTop: '0.7rem', gap: '0.3rem', flexDirection: 'column' }}>
        {time && (
          <RowWithIcon
            icon={<ClockIcon />}
            value={time}
          />
        )}

        {practitionerName && (
          <RowWithIcon
            icon={<UserIcon />}
            value={[practitionerName, practitionerRole?.specialty?.[0]?.coding?.[0]?.display]}
          />
        )}

      </div>
    </div>
  )
}

interface AppointmentProps {
  appointments: Appointment[]
}

function Appointments ({ appointments }: AppointmentProps) {
  return (
    <div>
      {appointments.map((appointment, index) => (
        <>
          <div
            key={appointment.id}
            style={{ display: 'grid', gridTemplateColumns: '5fr 1fr', alignItems: 'center' }}
          >
            <p style={{ fontSize: '1rem', fontWeight: '500', maxWidth: '90%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{appointment.description}</p>
            <p style={{ textTransform: 'capitalize', fontSize: '0.8rem', fontWeight: '500' }}>{appointment.status}</p>
            <p className={styles.cardSmallText}>{formatDate(appointment.start ?? '')}</p>
          </div>
          {index !== appointments.length - 1 && <Divider verticalMargin={'0.5rem'} />}
        </>
      ))}
    </div>
  )
}

interface RowWithIconProps {
  icon: JSX.Element,
  value: string | (string | undefined)[]
}
function RowWithIcon ({ icon, value }: RowWithIconProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.6rem', alignItems: 'center' }}>
      <div style={{ width: '22px', height: '22px' }}>
        {icon}
      </div>
      <div>
        {Array.isArray(value)
          ? value.map((text, index) => text && (
            <p
              style={{ lineHeight: '20px', fontSize: '0.9rem', fontWeight: 500 }}
              key={index}
            >
              {text}
            </p>
          ))
          : <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</p>
        }
      </div>
    </div>
  )
}
