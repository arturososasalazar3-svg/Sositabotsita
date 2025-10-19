let handler = async (m, { conn }) => {
  let who
  const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]

  if (mentionedJid) {
    who = mentionedJid
  } else if (m.quoted) {
    who = m.quoted.sender
  } else {
    who = m.sender
  }

  const name2 = m.sender.split('@')[0]
  const name = who.split('@')[0]

  await m.react('😊')

  let str
  if (who !== m.sender) {
    str = `😊 *@${name2}* está feliz por *@${name}*`
  } else {
    str = `😊 *@${name2}* está muy feliz... compartiendo alegría`
  }

  const videos = [
    'https://tenor.com/o595nAiltkE.gif',
    'https://tenor.com/nn0YjazkgaI.gif',
    'https://tenor.com/bIZi6.gif',
    'https://tenor.com/ggY4v5Nev12.gif',
    'https://tenor.com/bJZ9m.gif'
  ]

  const videoUrl = videos[Math.floor(Math.random() * videos.length)]

  await conn.sendMessage(
    m.chat,
    {
      video: { url: videoUrl },
      gifPlayback: true,
      caption: str,
      mentions: [who, m.sender]
    },
    { quoted: m }
  )
}

handler.help = ['feliz @tag', 'happy @tag']
handler.tags = ['anime']
handler.command = ['feliz', 'happy']
handler.group = true

export default handler