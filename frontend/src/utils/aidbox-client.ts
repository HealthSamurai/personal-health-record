import { Client } from 'aidbox-sdk'

export let client = new Client('http://localhost:8888', {
  username: 'client',
  password: 'secret'
})
