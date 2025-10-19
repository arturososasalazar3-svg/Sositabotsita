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

  await m.react('😔')

  let str
  if (who !== m.sender) {
    str = `😔 *@${name2}* está triste por *@${name}*`
  } else {
    str = `😔 *@${name2}* está muy triste... necesita apoyo`
  }

  const videos = [
    'https://tenor.com/b12jl.gif',
    'https://tenor.com/dUwxDSx2xTV.gif',
    'https://tenor.com/t3anM5GB7Yk.gif',
    'https://tenor.com/qkmyQGclPgU.gif',
    'https://tenor.com/p9OWwGadd1f.gif'
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

handler.help = ['sad @tag', 'triste @tag']
handler.tags = ['anime']
handler.command = ['sad', 'triste']
handler.group = true

export default handler