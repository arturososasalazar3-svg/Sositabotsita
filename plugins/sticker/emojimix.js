import fetch from 'node-fetch'
import { sticker } from '../../lib/sticker.js'
import fs from "fs"

const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
  fetch(url, options)
    .then(response => response.json())
    .then(json => resolve(json))
    .catch(err => reject(err))
})

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const res1 = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb5 = Buffer.from(await res1.arrayBuffer())

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      documentMessage: {
        title: '𝗦𝗧𝗜𝗞𝗘𝗥',
        fileName: `𝗦𝗧𝗜𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢`,
        jpegThumbnail: thumb5
      }
    }
  }

  if (!args[0]) return conn.reply(m.chat, `${emojis} Uso incorrecto.\nEjemplo: *${usedPrefix + command} 😎+🤑*`, m, fake)

  let [emoji, emoji2] = text.split`+`
  if (!emoji2) return conn.reply(m.chat, `⚠️ Debes escribir dos emojis separados con +`, m)

  let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji)}_${encodeURIComponent(emoji2)}`)

  for (let res of anu.results) {
    let img = res.media_formats?.png_transparent?.url || res.media_formats?.webp_transparent?.url
    if (!img) continue
    let stiker = await sticker(false, img, global.botname || "Bot", global.nombre || "Sticker")
    await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
  }
}

handler.help = ['emojimix *<emoji+emoji>*']
handler.tags = ['sticker']
handler.command = ['emojimix'] 

export default handler