import { clearable, countryCodeSchema, updateProfileSchema } from '@nexustimer/contracts'
import { hasFlag } from 'country-flag-icons'

export const updateProfileBodySchema = updateProfileSchema.extend({
  country: clearable(countryCodeSchema.refine(hasFlag, 'Invalid country code'))
})
