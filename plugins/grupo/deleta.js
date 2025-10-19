let handler = async (m, { conn, isGroup }) => {
  if (!m.quoted)
    return conn.reply(m.chat, '❀ Cita el mensaje que deseas eliminar.', m, fake)

  try {
    const botJid = conn.decodeJid(conn.user.id)
    const senderJid = conn.decodeJid(m.sender)
    const quoted = m.quoted
    const quotedJid = conn.decodeJid(quoted.sender)

    const stanzaId = quoted.id || m.message?.extendedTextMessage?.contextInfo?.stanzaId
    const participant = quotedJid || m.message?.extendedTextMessage?.contextInfo?.participant

    if (!stanzaId || !participant)
      return conn.reply(m.chat, '✧ No pude identificar el mensaje a eliminar.', m, fake)

    if (quotedJid === botJid) {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: true,
          id: stanzaId
        }
      })
    } else {
      if (isGroup) {                                                                                                                                    const { participants } = await conn.groupMetadata(m.chat)
        const isAdmin = jid => participants.some(p => p.id === jid && /admin|superadmin/i.test(p.admin || ''))

        if (!isAdmin(senderJid))
          return conn.reply(m.chat, 'ꕥ Solo los administradores pueden borrar mensajes de otros usuarios.', m, fake)

        if (!isAdmin(botJid))
          return conn.reply(m.chat, handler.botAdmin, m)
      }

      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: stanzaId,
          participant: participant
        }
      })
    }
  } catch (err) {                                                                                                                                   console.error('[✧ ERROR delete]', err)
    conn.reply(m.chat, '✧ No se pudo eliminar el mensaje. WhatsApp podría estar limitando esta acción.', m, fake)
  }
}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['del', 'delete']
handler.botAdmin = true
handler.admin = true

export default handler