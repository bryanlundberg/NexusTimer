import { BrevoClient } from '@getbrevo/brevo'

export const BREVO_API_KEY = process.env.BREVO_API_KEY

const brevo = new BrevoClient({
  apiKey: BREVO_API_KEY!
})

export default brevo
