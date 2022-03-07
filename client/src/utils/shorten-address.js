export const shortenAddress = (address) => {
  if (address === undefined) return 'Loading ...'
  return `${address.slice(0, 7)} ... ${address.slice(address.length - 5)}`
}
