let handler = async (m, { conn, text, participants, groupMetadata }) => {
  try {
    const users = participants
      .map(u => u.id)
      .filter(v => v !== conn.user.jid)

    const res = await fetch('https://i.postimg.cc/TwVX565r/1760498734266.jpg');
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
                name: `𝗠𝗘𝗡𝗖𝗜𝗢́𝗡 𝗚𝗘𝗡𝗘𝗥𝗔𝗟\n${botname}`,
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    const groupJid = m.chat
    const groupName = text?.trim() || groupMetadata?.subject || 'everyone'

    const message = `@${groupJid}`

    await conn.sendMessage(
      m.chat,
      {
        text: message,
        mentions: users,
        contextInfo: {
          mentionedJid: users,
          groupMentions: [{
            groupJid: groupJid,
            groupSubject: groupName
          }]
        }
      },
      { quoted: fkontak } 
    )
  } catch (error) {
    console.error('Error en comando .everyone:', error)
    await m.reply(`⚠️ Ocurrió un error al ejecutar el comando.`)
  }
}

handler.command = ['tagtext', 'tagt', 'tag2']
handler.help = ['tagtext', 'tagt']
handler.tags = ['grupo']
handler.admin = true
handler.group = true

export default handler