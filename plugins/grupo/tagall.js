const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
    if (usedPrefix.toLowerCase() === 'a') return;

    const customEmoji = '✦';
    m.react(customEmoji);

        if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        return;
    }


    const mensaje = args.join(' ');
    const info = mensaje ? `▢ Mensaje: ${mensaje}` : '▢ Llamado general a todos los miembros';

    let texto = '┏━━━━━━━━━━━━━━━━━━━⌬\n';
    texto += '┃    L L A M A D O   G E N E R A L   \n';
    texto += `┃   Total miembros: ${participants.length}   \n`;
    texto += '┗━━━━━━━━━━━━━━━━━━━⌬\n\n';
    texto += `${info}\n\n`;

    for (const miembro of participants) {
        const memberId = miembro.id.split('@')[0];
        const number = memberId.includes(':') ? memberId.split(':')[0] : memberId;
        texto += `⟡ @${number}\n`;
    }

    texto += `\n⟢ Fin del llamado ⟣`;

    conn.sendMessage(m.chat, { text: texto, mentions: participants.map(p => p.id) }, { quoted: m });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['grupo'];
handler.command = ['tagall', 'todos'];
handler.group = true;

export default handler;