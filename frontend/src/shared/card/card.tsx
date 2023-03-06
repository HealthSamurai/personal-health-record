interface Props {
  title: string
  description: string
  icon: JSX.Element
}

export function Card ({ title, description, icon }: Props): JSX.Element {
  return (
    <div>
      {icon}
      <div>
        <p>{title}</p>
        <p>{description}</p>
      </div>
    </div>
  )
}
