import { Table } from '@nextui-org/react'
import { Patient } from 'aidbox-sdk/aidbox-types'
import { useEffect, useState } from 'react'

import { aidboxClient } from '../../utils/aidbox-client'
import { transformAddress } from '../../utils/transform-address'
import { Layout } from '../layout'

import { Workspace } from './components/workspace'

interface PatientTableItem {
  name?: string
  id?: string
  address?: string
}

const columns: { key: keyof PatientTableItem, label: string }[] = [
  {
    key: 'id',
    label: 'id'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'address',
    label: 'address'
  }
]

export function Dashboard () {
  const searchParams = new URLSearchParams(document.location.search)
  const patientId = searchParams.get('id')

  const [patient, setPatient] = useState<Patient>()
  const [patients, setPatients] = useState<PatientTableItem[]>()

  useEffect(() => {
    if (!patientId) {
      aidboxClient.getResources('Patient')
        .elements(['name', 'address', 'id'])
        .then((response) => {
          setPatients(response.entry?.map((r) => ({
            name: r.resource?.name?.[0]?.family + ' ' + r.resource?.name?.[0]?.given?.[0],
            id: r.resource?.id,
            address: r.resource.address ? transformAddress(r.resource.address) : undefined
          })) ?? [])
        })
      return
    }

    aidboxClient.getResource('Patient', patientId).then((response) => {
      if ((response instanceof Error)) return

      setPatient(response)
    })
  }, [patientId])

  if (!patientId) {
    return (
      <div style={{ padding: '2rem 20rem' }}>
        <Table
          aria-label='Patients'
          css={{
            height: 'auto',
            minHeight: '10rem',
            minWidth: '100%'
          }}
          onSelect={(i) => console.log(i)}
          selectionMode={'single'}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                align='start'
                key={column.key}
              >
                {column.label}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={patients ?? []}>
            {(row) => (
              <Table.Row key={row.id}>
                {(columnKey) => (
                  <Table.Cell>
                    {columnKey === 'id'
                      ? (
                        <a href={`?id=${row.id}`}>{row[columnKey as keyof PatientTableItem]}</a>
                      )
                      : row[columnKey as keyof PatientTableItem]
                    }

                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Layout patient={patient} />
      <div style={{ padding: '2rem 0', background: '#FAFBFD', width: 'calc(100% - 300px)' }}>
        <Workspace patient={patient} />
      </div>
    </div>
  )
}
