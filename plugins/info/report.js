let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el error que desea reportar.`, m, fake)
    if (text.length < 10) return conn.reply(m.chat, `${emoji} Especifique bien el error, mínimo 10 caracteres.`, m, fake)
    if (text.length > 1000) return conn.reply(m.chat, `${emoji2} *Máximo 1000 caracteres para enviar el error.`, m, fake)

    const teks = `*${emoji} \`R E P O R T E\` ${emoji}*

👑 Número:
• Wa.me/${m.sender.split`@`[0]}

✨ Usuario: 
• ${m.pushName || 'Anónimo'}

🔥 Mensaje:
• ${text}`

    const mensajeFinal = m.quoted ? teks + '\n\n' + (m.quoted?.text || '') : teks

    await conn.reply(`${suittag}@s.whatsapp.net`, mensajeFinal, m, fake, { mentions: conn.parseMention(mensajeFinal) })
    await conn.reply('120363420911001779@g.us', mensajeFinal, m, fake, { mentions: conn.parseMention(mensajeFinal) })

    conn.reply(m.chat, `${emoji} El reporte se envió a mi creador y al grupo correspondiente.`, m, fake)
}

handler.help = ['reportar']
handler.tags = ['info']
handler.command = ['reporte', 'report', 'reportar', 'bug', 'error']

export default handler