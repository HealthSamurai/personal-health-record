import { Client } from 'aidbox-sdk'

export const client = new Client('http://localhost:8888', {
  username: 'client',
  password: 'secret'
})
