export function formatDate (date: string) {
  if (date.includes('T')) {
    let [year, month, day] = date.split('T')[0].split('-')
    return `${day}/${month}/${year}`
  }

  let [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}
