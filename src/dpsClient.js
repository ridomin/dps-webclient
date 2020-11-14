import { generateSasToken } from './hmac'

export async function registerDevice (scopeId, deviceId, deviceKey, modelId) {
  const endpoint = 'https://dps-proxy.azurewebsites.net/register'
  const url = `${endpoint}?scopeId=${scopeId}&deviceId=${deviceId}&deviceKey=${encodeURIComponent(deviceKey)}&modelId=${modelId}`
  console.log(url)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'utf-8'
    }
  })
  const resp = await response.json()
  console.log(resp)
  return resp
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
