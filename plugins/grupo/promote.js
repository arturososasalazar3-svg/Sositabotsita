var handler = async (m, { conn, usedPrefix, command, text }) => {
    const res = await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg');
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
                name: '𝗡𝗨𝗘𝗩𝗢 𝗔𝗗𝗠𝗜𝗡',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    
    let user;
    if (m.quoted) {
        user = m.quoted.sender
            || m.quoted.participant
            || m.message?.extendedTextMessage?.contextInfo?.participant
            || m.quoted.key?.participant
            || m.quoted.key?.remoteJid;
    } else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '');
        if (number.length < 11 || number.length > 13) {
            return conn.reply(m.chat, `↷♛߹߬ Debe de responder o mencionar a una persona válida para usar este comando.`, m, rcanal);
        }
        user = number + "@s.whatsapp.net";
    } else {
        return conn.reply(m.chat, `${emoji} Debe de responder o mencionar a una persona para usar este comando.`, m, rcanal);
    }

    if (!user) return conn.reply(m.chat, `No pude obtener el JID de la persona. Intenta mencionarla o responde su mensaje.`, m);

    
    if (!user.includes('@')) user = user + '@s.whatsapp.net';

    try {
        let name;
        try {
            name = await conn.getName(user);
        } catch {
            name = user.split('@')[0];
        }
        if (!name) name = user.split('@')[0];

        
        let groupMetadata = await conn.groupMetadata(m.chat);

        
        const jidToSearch = user;
        let participant = groupMetadata.participants.find(p =>
            p.id === jidToSearch ||
            p.jid === jidToSearch ||
            p.participant === jidToSearch ||
            
            (p.id && p.id.split('@')[0] === jidToSearch.split('@')[0])
        );

        
        let isAdmin = false;
        if (participant) {
            const adminField = participant.admin ?? participant.isAdmin ?? participant.role;
            if (adminField === true) isAdmin = true;
            if (typeof adminField === 'string' && (adminField === 'admin' || adminField === 'superadmin' || adminField === 'administrator')) isAdmin = true;
        }

        if (isAdmin) {
            return conn.sendMessage(m.chat, {
                text: `${emoji} @${user.split('@')[0]} ya es administrador.`,
                contextInfo: { mentionedJid: [user] }
            }, { quoted: fkontak });
        }

        
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');

        await conn.sendMessage(m.chat, {
            text: `${emoji} @${user.split('@')[0]} fue promovido a administrador con éxito.`,
            contextInfo: { mentionedJid: [user] }
        }, { quoted: fkontak });

    } catch (e) {
        conn.reply(m.chat, `❌ Error al promover: ${e}`, m);
    }
};

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote','daradmin','promover']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler