import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
    let who;
    let mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;

    if (mentionedJid) {
        who = mentionedJid;
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name2 = m.sender.split('@')[0];
    let name = who.split('@')[0];

    m.react('🫂');

    let str;
    if (who !== m.sender) {
        str = `🫂 *@${name2}* le da un abrazo a *@${name}*`;
    } else {
        str = `🫂 *@${name2}* se abraza a sí mismo. ¡Necesitas un abrazo!*`;
    }

    if (m.isGroup) {
        const videos = [
            'https://tenor.com/bEm6t.gif',
            'https://tenor.com/ckkl7QnHtg2.gif',
            'https://tenor.com/bLusbUcOQS2.gif',
            'https://tenor.com/ihGOGqmJEN6.gif',
            'https://tenor.com/bndZV.gif'
        ];

        const video = videos[Math.floor(Math.random() * videos.length)];

        conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [who, m.sender]  
        }, { quoted: m });
    }
};

handler.help = ['hug @tag', 'abrazar @tag'];
handler.tags = ['anime'];
handler.command = ['hug', 'abrazar'];
handler.group = true;

export default handler;
