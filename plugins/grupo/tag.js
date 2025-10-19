import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'
import fetch from 'node-fetch'

var handler = async (m, { conn, text, participants, isOwner, isAdmin }) => {

  if (!m.quoted && !text) return conn.reply(m.chat, `${emoji} Debes enviar un texto para hacer un tag.`, m, fake)

  const res = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  const fkontak = {
      key: {
          participants: "0@s.whatsapp.net",
          remoteJid: "status@broadcast",
          fromMe: false,
          id: "Halo"
      },
      message: {
          locationMessage: {
              name: `𝗠𝗘𝗡𝗦𝗔𝗝𝗘 𝗗𝗘 𝗨𝗡 𝗔𝗗𝗠𝗜𝗡 𝗗𝗘𝗟 𝗚𝗥𝗨𝗣𝗢`,
              jpegThumbnail: thumb2
          }
      },
      participant: "0@s.whatsapp.net"
  };

  try { 
    let users = participants.map(u => conn.decodeJid(u.id))

    let tagText = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : "*Hola!!*")
    let newText = `${tagText}`

    let q = m.quoted ? m.quoted : m || m.text || m.sender
    let c = m.quoted ? await m.getQuotedObj() : m.msg || m.text || m.sender

    let msg = conn.cMod(
      m.chat, 
      generateWAMessageFromContent(
        m.chat, 
        { [m.quoted ? q.mtype : 'extendedTextMessage']: m.quoted ? c.message[q.mtype] : { text: '' || c }},
        { quoted: fkontak, userJid: conn.user.id }
      ), 
      newText, 
      conn.user.jid, 
      { mentions: users }
    )
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch {  
    let users = participants.map(u => conn.decodeJid(u.id))
    let quoted = m.quoted ? m.quoted : m
    let mime = (quoted.msg || quoted).mimetype || ''
    let isMedia = /image|video|sticker|audio/.test(mime)
    let tagText = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : "*Hola!!*")
    let htextos = `${tagText}`

    if (isMedia) {
      let mediax = await quoted.download?.()
      let messageContent = {}

      if (quoted.mtype === 'imageMessage') {
        messageContent = { image: mediax, caption: htextos, mentions: users }
      } else if (quoted.mtype === 'videoMessage') {
        messageContent = { video: mediax, caption: htextos, mentions: users, mimetype: 'video/mp4' }
      } else if (quoted.mtype === 'audioMessage') {
        messageContent = { audio: mediax, fileName: 'Hidetag.mp3', mimetype: 'audio/mp4', mentions: users }
      } else if (quoted.mtype === 'stickerMessage') {
        messageContent = { sticker: mediax, mentions: users }
      }

      let msg = generateWAMessageFromContent(m.chat, messageContent, { quoted: fkontak, userJid: conn.user.id })
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } else {
      let msg = generateWAMessageFromContent(
        m.chat,
        { extendedTextMessage: { text: `${htextos}\n`, contextInfo: { mentionedJid: users } } },
        { quoted: fkontak, userJid: conn.user.id }
      )
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }
  }
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag']
handler.group = true
handler.admin = true

export default handler