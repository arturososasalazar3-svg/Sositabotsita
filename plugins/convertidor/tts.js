import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const defaultLang = 'es'

const handler = async (m, { conn, args, text }) => {
  if (!text) return conn.reply(m.chat, '${emoji} Por favor, ingresa el texto para convertir a audio.‽', m, rcanal)

  let lang = args[0]
  let txt = args.slice(1).join(' ')

  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    txt = args.join(' ')
  }

  const idiomasDisponibles = {
    es: 'Español',
    en: 'Inglés',
    fr: 'Francés',
    pt: 'Portugués',
    it: 'Italiano',
    ja: 'Japonés',
    ko: 'Coreano',
    de: 'Alemán',
    hi: 'Hindi',
    ru: 'Ruso'
  }

  if (!idiomasDisponibles[lang]) lang = defaultLang

  const res2 = await fetch('https://i.postimg.cc/FKm75nJz/1759734148064.jpg')
  const thumb3 = Buffer.from(await res2.arrayBuffer())

  const fkontak = {
    key: {
      fromMe: false,
      remoteJid: '120363368035542631@g.us',
      participant: m.sender
    },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: `🎧 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥 𝗧𝗧𝗦 (${idiomasDisponibles[lang] || 'Desconocido'})`,
        jpegThumbnail: thumb3
      }
    }
  }

  txt = txt.replace(/[^\p{L}\p{N}\p{Zs}]/gu, '')

  let res
  try {
    res = await generarTTS(txt, lang)
  } catch {
    await conn.reply(m.chat, '⚠ Error con el idioma seleccionado, se usará español por defecto.', m)
    res = await generarTTS(txt, defaultLang)
  }

  if (res)
    await conn.sendMessage(
      m.chat,
      { audio: res, mimetype: 'audio/mpeg', ...global.rcanal },
      { quoted: fkontak }
    )
}

handler.help = ['tts <lang> <texto>']
handler.tags = ['transformador']
handler.command = ['tts']
handler.group = true
handler.register = true

export default handler

function generarTTS(text, lang = 'es') {
  return new Promise((resolve, reject) => {
    try {
      const __dirname = dirname(fileURLToPath(import.meta.url))
      const voz = gtts(lang)
      const filePath = join(__dirname, '../../tmp', `${Date.now()}.wav`)

      voz.save(filePath, text, () => {
        const buffer = readFileSync(filePath)
        unlinkSync(filePath)
        resolve(buffer)
      })
    } catch (e) {
      reject(e)
    }
  })
}