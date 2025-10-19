import { createMessageWithReactions, setActionCallback } from '../../lib/reaction.js';

let handler = async (m, { conn, participants }) => {

    const actions = {
        '👍': { type: 'kick_all', data: { chat: m.chat, participants: participants } },
        '👎': { type: 'cancel_kick', data: { chat: m.chat } },
    };


    const infoMessage = `
⚠️ *ADVERTENCIA* ⚠️

¿Estás seguro de que quieres eliminar a todos los miembros que no son administradores?

👍 = *Sí*, eliminar a todos
👎 = *No*, cancelar
`;


    const msg = await conn.reply(m.chat, infoMessage, m);
    await createMessageWithReactions(conn, msg, actions);
};




setActionCallback('kick_all', async (conn, chat, data) => {
    const { participants } = data;
    const botId = conn.user.jid;


    const groupAdmins = participants.filter(p => p.admin);
    const groupOwner = groupAdmins.find(p => p.isAdmin)?.id;
    const groupNoAdmins = participants.filter(p => p.id !== botId && p.id !== groupOwner && !p.admin).map(p => p.id);

    if (groupNoAdmins.length === 0) {
        return conn.sendMessage(chat, { text: '*No hay usuarios para eliminar.*' });
    }


    for (let userId of groupNoAdmins) {
        await conn.groupParticipantsUpdate(chat, [userId], 'remove');
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    conn.sendMessage(chat, { text: '*Eliminación Exitosa.*' });
});


setActionCallback('cancel_kick', async (conn, chat) => {
    conn.sendMessage(chat, { text: '*Se ha cancelado la eliminación.*' });
});


handler.help = ['kickall'];
handler.tags = ['grupo'];
handler.command = ['kickall'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;