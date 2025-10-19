// © Deylin 
// © Deylin

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(m.chat, `${emoji} Por favor, ingrese su sugerencia en el siguiente formato:\n\ncomando | descripción\n\nEjemplo:\n${usedPrefix}saludo | Envía un mensaje de bienvenida al usuario.`, m, rcanal);
  }

  let parts = text.split("|").map(p => p.trim());
  if (parts.length < 2) {
    return conn.reply(m.chat, `${emoji} Formato incorrecto. Use:\ncomando | descripción`, m, rcanal);
  }

  let [nuevoComando, descripcion] = parts;
  if (nuevoComando.length < 1) {
    return conn.reply(m.chat, `${emoji} El nombre del comando es muy corto.`, m, rcanal);
  }

  if (descripcion.length < 10) {
  return conn.reply(m.chat, `${emoji} La descripción debe tener al menos 10 caracteres.`, m, rcanal);
}

if (descripcion.length > 1000) {
  return conn.reply(m.chat, `${emoji} La descripción debe tener máximo 1000 caracteres.`, m, rcanal);
}

  let teks = `*👑 SUGERENCIA DE COMANDOS 👑*\n\n✎ *Comando propuesto:*\n• ${nuevoComando}\n\n✎ *Descripción:*\n• ${descripcion}\n\n✎ *Usuario:*\n• ${m.pushName || 'Anónimo'}\n• Número: wa.me/${m.sender.split`@`[0]}\n\n_Para aprobar o rechazar la sugerencia, el staff debe responder a este mensaje con .aceptar o .noaceptar seguido de una razón (opcional)._`;

  let ownerJid = '50432955554@s.whatsapp.net';
  let staffGroup = '120363420911001779@g.us';

  await conn.sendMessage(ownerJid, { text: teks, mentions: [m.sender] });
  await conn.sendMessage(staffGroup, { text: teks, mentions: [m.sender] });

  await conn.reply(m.chat, `${emoji} *Tu sugerencia se ha enviado al staff.*\nRecibirás una notificación cuando sea revisada.`, m, rcanal);
}

handler.help = ['sugerir']
handler.tags = ['main']
handler.command = ['sugerir', 'suggest']

export default handler