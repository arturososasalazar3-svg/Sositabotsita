import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  if (m.isGroup && db?.data?.chats[m.chat] && !db.data.chats[m.chat].nsfw) {
    return m.reply(`${emoji} El contenido *NSFW* está desactivado en este grupo.\n> Un administrador puede activarlo con » *${usedPrefix}nsfw on*`)
  }

  try {

    await m.react(emojis)
    await conn.reply(m.chat, '✎ Buscando su *Waifu* espere un momento...', m, rcanal)

    let res = await fetch('https://g-mini-ia.vercel.app/api/nsfw')
    if (!res.ok) throw await res.text()
    
    let json = await res.json()
    if (!json || !json.url) throw 'No se pudo obtener la waifu.'

    await conn.sendFile(m.chat, json.url, 'waifu.jpg', `✧ Aquí tienes tu *Waifu* sin restricción.`, m, rcanal)
  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al obtener la waifu.')
  }
}

handler.help = ['waifu']
handler.tags = ['nsfw']
handler.command = ['waifu']
handler.group = true

export default handler