import { randomBytes } from 'crypto'

const handler = async (m, { conn, command, usedPrefix, text }) => {
  if (!text) return conn.reply(m.chat, '⚠️ Te faltó el texto que quieres transmitir a todos los chats.', m, rcanal)

  await conn.reply(m.chat, '*✅ El texto se está enviando a todos los chats...*', m, rcanal)

  const start2 = Date.now()

  const groups = Object.values(await conn.groupFetchAllParticipating())
  const chatsPrivados = Object.keys(global.db.data.users).filter((u) => u.endsWith('@s.whatsapp.net'))

  let enviadosGrupo = 0
  let enviadosPriv = 0

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    try {
      await conn.sendMessage(group.id, { text }, { quoted: m })
      enviadosGrupo++
    } catch (e) {
      console.error(`❌ Error en grupo ${group.subject}:`, e.message)
    }
    await delay(8000) 
  }

  for (const user of chatsPrivados) {
    try {
      await conn.sendMessage(user, { text }, { quoted: m })
      enviadosPriv++
    } catch (e) {
      if (e?.data === 429) {
        console.log('⏳ Rate limit en privado, esperando 30s...')
        await delay(30000)
      } else {
        console.error(`❌ Error en privado ${user}:`, e.message)
      }
    }
    await delay(5000) 
  }

  const end2 = Date.now()
  let time2 = Math.floor((end2 - start2) / 1000)
  if (time2 >= 60) {
    const minutes = Math.floor(time2 / 60)
    const seconds = time2 % 60
    time2 = `${minutes}m ${seconds}s`
  } else {
    time2 = `${time2}s`
  }

  await m.reply(`⭐️ *Broadcast finalizado*\n\n👑 Grupos: ${enviadosGrupo}\n🔥 Privados: ${enviadosPriv}\n⚡ Total: ${enviadosGrupo + enviadosPriv}\n\n⏱️ Tiempo total: ${time2}`)
}

handler.help = ['broadcast', 'bc']
handler.tags = ['owner']
handler.command = ['bc', 'comunicado']
handler.owner = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const randomID = (length) => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length)