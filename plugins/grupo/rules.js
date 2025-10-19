const handler = async (m, { conn, text, command }) => {
let metadata = await conn.groupMetadata(m.chat)
  let reglas = metadata.desc || '*No hay reglas en el grupo.*\n> sigue las reglas comunes de los grupos.'
return conn.reply(m.chat, `${reglas}`, m, rcanal);
}

handler.command = handler.help = ['reglas', 'rules', 'descripcion', 'description']
handler.tags = ['grupo']
handler.group = true;

export default handler;