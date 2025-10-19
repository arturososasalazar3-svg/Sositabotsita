// © Deylin 

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!global.staffs || !Array.isArray(global.staffs)) global.staffs = []


  if (!m.quoted) return m.reply(`${emoji} Responde al mensaje de sugerencia para rechazarlo.`)
  let razon = text.trim() || 'Sin razón especificada.'

  let regex = /wa\.me\/(\d+)/i
  let match = m.quoted.text.match(regex)
  if (!match) {
    return m.reply(`${emoji} No se pudo extraer el número del usuario de la sugerencia.`)
  }
  let userId = match[1] + "@s.whatsapp.net"


  await conn.reply(userId, `${emoji} *Tu sugerencia fue RECHAZADA*\n\n_El staff ha revisado tu propuesta y decidió no implementarla._\nRazón: ${razon}`, m, rcanal)
  m.reply(`${emoji} Sugerencia rechazada y notificada al usuario.`)
}
handler.help = ['noaceptar']
handler.tags = ['owner']
handler.command = ['noaceptar']
handler.owner = true;

export default handler