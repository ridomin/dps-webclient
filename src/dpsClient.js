import { generateSasToken } from './hmac'

export async function registerDevice (scopeId, deviceId, deviceKey, modelId) {
  const endpoint = 'https://dps-client.azurewebsites.net/api/Provision'
  const qs = encodeURIComponent(`ScopeId=${scopeId};DeviceId=${deviceId};SharedAccessKey=${deviceKey};ModelId=${modelId}`)
  const url = `${endpoint}?DCF=${qs}`
  console.log(url)
  const resp = await fetch(url,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'utf-8'
      }
    }
  )
  const response = await resp.text()
  console.log(response)
  return response
}

export const registerDeviceRest = async (scopeId, deviceId, deviceKey) => {
  const url = `https://global.azure-devices-provisioning.net/${scopeId}/registrations/${deviceId}/register?api-version=2019-03-31`
  const token = await generateSasToken(url, deviceKey, 'registration', 3600000)
  console.log(token)
  const resp = await fetch(url,
    {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'utf-8',
        Authorization: token
      },
      redirect: 'follow',
      body: JSON.stringify({ registrationId: deviceId })
    }
  )
  const response = await resp.json()
  console.log(response)
}
