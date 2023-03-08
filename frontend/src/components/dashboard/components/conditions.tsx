import { Condition } from 'aidbox-sdk/aidbox-types'
import { useEffect, useState } from 'react'

import { CardWrapper } from '../../../shared/card'
import { Divider } from '../../../shared/divider/divider'
import { client } from '../../../utils/aidbox-client'
import { formatDate } from '../../../utils/format-date'

export function Conditions (): JSX.Element {
  let [conditions, setConditions] = useState<Condition[]>([])
  let [loading, setLoading] = useState(true)
  let [total, setTotal] = useState<number>(0)
  let searchParams = new URLSearchParams(document.location.search)
  let patient_id = searchParams.get('id')

  useEffect(() => {
    client.getResources('Condition')
      .where('patient', `Patient/${patient_id}`)
      .count(3)
      .then((response) => {
        setConditions(response.entry.map((condition) => condition.resource))
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setTotal(response.total)
        setLoading(false)
      })
  }, [patient_id])

  if (loading) {
    return <div>Loading</div>
  }

  let action = {
    label: 'Show more',
    onClick: () => ({})
  }

  let bottomActions = total > 3 ? action : undefined
  let title = 'Diagnosis' + (total && `(${total})`)

  return (
    <CardWrapper
      title={title}
      bottomActions={bottomActions}
    >
      {conditions.map((condition, index) => (
        <>
          <div
            key={condition.id}
            style={{ display: 'grid', gridTemplateColumns: '5fr 1fr', alignItems: 'center' }}
          >
            <p style={{ fontSize: '1rem', fontWeight: '500', maxWidth: '90%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{condition.code?.text}</p>
            <p style={{ textTransform: 'capitalize', fontSize: '0.8rem', fontWeight: '500' }}>{condition.clinicalStatus?.coding?.[0].code}</p>
            <p style={{ fontSize: '0.8rem', fontWeight: '500' }}>{formatDate(condition.recordedDate ?? '')}</p>
            <p style={{ fontSize: '0.8rem', fontWeight: '500' }}>{condition.severity?.coding?.[0].display}</p>
          </div>

          {index !== conditions.length - 1 && <Divider verticalMargin={'0.5rem'} />}
        </>
      ))}
    </CardWrapper>
  )
}
