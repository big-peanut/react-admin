import axios from 'axios'
import { userListSchema, User } from './schema'

// Function to fetch users from the backend
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await axios.get('https://api.conasmyle.in/admins')
    const users = userListSchema.parse(response.data.data)
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}
