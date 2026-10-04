import { z } from 'zod'

export const realtimeTicketResponseSchema = z.object({
  url: z.string(),
  ticket: z.string()
})

export type RealtimeTicketResponse = z.infer<typeof realtimeTicketResponseSchema>
