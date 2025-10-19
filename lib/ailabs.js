import axios from 'axios'
import chalk from 'chalk'
import FormData from 'form-data'

const aiLabs = {
  api: {
    base: 'https://text2video.aritek.app',
    endpoints: {
      text2img: '/text2img',
      generate: '/txt2videov3',
      video: '/video'
    }
  },
  headers: {
    'user-agent': 'NB Android/1.0.0',
    'accept-encoding': 'gzip',
    'content-type': 'application/json',
    authorization: ''
  },
  state: { token: null },
  setup: {
    cipher: 'hbMcgZLlzvghRlLbPcTbCpfcQKM0PcU0zhPcTlOFMxBZ1oLmruzlVp9remPgi0QWP0QW',
    shiftValue: 3,
    dec(text, shift) {
      return [...text].map(c => /[a-z]/.test(c)
        ? String.fromCharCode((c.charCodeAt(0) - 97 - shift + 26) % 26 + 97)
        : /[A-Z]/.test(c)
          ? String.fromCharCode((c.charCodeAt(0) - 65 - shift + 26) % 26 + 65)
          : c).join('')
    },
    async decrypt() {
      if (aiLabs.state.token) return aiLabs.state.token
      const input = aiLabs.setup.cipher
      const shift = aiLabs.setup.shiftValue
      const decrypted = aiLabs.setup.dec(input, shift)
      aiLabs.state.token = decrypted
      aiLabs.headers.authorization = decrypted
      return decrypted
    }
  },
  deviceId() {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  },
  async text2img(prompt) {
    if (!prompt?.trim()) return { success: false, code: 400, result: { error: 'Prompt vacío' } }
    const token = await aiLabs.setup.decrypt()
    const form = new FormData()
    form.append('prompt', prompt)
    form.append('token', token)
    try {
      const url = aiLabs.api.base + aiLabs.api.endpoints.text2img
      const res = await axios.post(url, form, { headers: { ...aiLabs.headers, ...form.getHeaders() } })
      const { code, url: imageUrl } = res.data
      if (code !== 0 || !imageUrl) return { success: false, code: res.status, result: { error: 'Fallo generación' } }
      return { success: true, code: res.status, result: { url: imageUrl.trim(), prompt } }
    } catch (err) {
      return { success: false, code: err.response?.status || 500, result: { error: err.message || 'Error' } }
    }
  },
  async generate({ prompt = '', type = 'video', isPremium = 1 } = {}) {
    if (!prompt?.trim()) return { success: false, code: 400, result: { error: 'Prompt vacío' } }
    if (!/^(image|video)$/.test(type)) return { success: false, code: 400, result: { error: 'Tipo inválido' } }
    if (type === 'image') return aiLabs.text2img(prompt)
    await aiLabs.setup.decrypt()
    const payload = { deviceID: aiLabs.deviceId(), isPremium, prompt, used: [], versionCode: 59 }
    try {
      const url = aiLabs.api.base + aiLabs.api.endpoints.generate
      const res = await axios.post(url, payload, { headers: aiLabs.headers })
      const { code, key } = res.data
      if (code !== 0 || !key || typeof key !== 'string') return { success: false, code: res.status, result: { error: 'Key inválida' } }
      return aiLabs.video(key)
    } catch (err) {
      return { success: false, code: err.response?.status || 500, result: { error: err.message || 'Error' } }
    }
  },
  async video(key) {
    if (!key) return { success: false, code: 400, result: { error: 'Key inválida' } }
    await aiLabs.setup.decrypt()
    const payload = { keys: [key] }
    const url = aiLabs.api.base + aiLabs.api.endpoints.video
    const maxAttempts = 35
    const delay = 3000
    let attempt = 0
    while (attempt < maxAttempts) {
      attempt++
      try {
        const res = await axios.post(url, payload, { headers: aiLabs.headers, timeout: 15000 })
        const { code, datas } = res.data
        if (code === 0 && Array.isArray(datas) && datas.length) {
          const data = datas[0]
            if (!data.url) {
              await new Promise(r => setTimeout(r, delay))
              continue
            }
          return { success: true, code: res.status, result: { url: data.url.trim(), safe: data.safe === 'true', key: data.key, progress: '100%' } }
        }
      } catch (err) {
        if (['ECONNRESET','ECONNABORTED','ETIMEDOUT'].includes(err.code) && attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, delay))
          continue
        }
        return { success: false, code: err.response?.status || 500, result: { error: err.message || 'Error' } }
      }
    }
    return { success: false, code: 504, result: { error: 'Timeout' } }
  }
}

export { aiLabs }
