export const toIndividualUppercaseFirst = (str: string): string => {
  const str2 = str.charAt(0).toUpperCase() + str.slice(1)
  return str2
}
export const toUppercaseFirst = (str: string): string => {
  return str
    .split(' ')
    .map((s) => toIndividualUppercaseFirst(s))
    .join(' ')
}
