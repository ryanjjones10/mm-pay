import getUuid from 'uuid-by-string'
import v4 from 'uuid/v4'

// This is a randomly-generated uuid (non-deterministic).
export const generateUUID = (value?: string): string => {
  if (value) return getUuid(value)
  return v4() as string
}
