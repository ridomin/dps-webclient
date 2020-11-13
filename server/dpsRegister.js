import { createHmac, generateSasToken } from './hmac.js'
import fetch from 'node-fetch'

const scopeId = '0ne001617A2'
const deviceId = 'dev01' // 'device' + Date.now()
const masterKey = 'y3bcyTw0qTZ14jcxKNz6tv1Ntp8PdN+SzCa8Nyuaek0aif6iZLldm3kHawb5DTp6BzBlqXPjM1+Hn7GO3UJ7EA=='
let deviceKey = ''
const modelId = 'dtmi:com:example:Thermostat;1'

const register = async () => {
  deviceKey = await createHmac(masterKey, deviceId)
  console.log('dk', deviceKey)
  const base = 'https://global.azure-devices-provisioning.net/'
  const path = `${scopeId}/registrations/${deviceId}`
  const url = `${base}${path}/register?api-version=2019-03-31`
  const token = await generateSasToken(path, deviceKey, 'registration', 3600000)
  console.log(token)
  const resp = await fetch(url,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'utf-8',
        Authorization: token
      },
      body: JSON.stringify({ registrationId: deviceId, payload: { modelId } })
    }
  )
  const response = await resp.json()
  console.log(response)
  if (response && response.status && response.status === 'assigning') {
    setTimeout(async () => {
      const opid = response.operationId
      const statusUrl = `${base}${path}/operations/${opid}?api-version=2019-03-31`
      const resp = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'utf-8',
          Authorization: token
        }
      })
      const provResult = await resp.json()
      console.log(provResult)
    }, 2000)
  }
}

register().catch(e => console.log(e))
