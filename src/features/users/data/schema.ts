import { z } from 'zod'

// Define the user schema with the updated status field as a boolean
const userSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  alias: z.string(),
  emailAddress: z.string(),
  mobileNumber: z.string(),
  enabled: z.boolean(),
  createdTimestamp: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)