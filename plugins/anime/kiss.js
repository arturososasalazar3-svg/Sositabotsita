import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
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
    m.react('💋');

    let str;
        if (who !== m.sender) {
        str = `💋 *@${name2}* le da un beso a *@${name}*`;
    } else if (m.quoted) {
        str = `😘 *@${name2}* besa suavemente a *@${name}*`;
    } else {
        str = `😍 *@${name2}* lanza un beso para todos los del grupo 😘`;
    }

    if (m.isGroup) {
        const videos = [
            'https://tenor.com/jRVsCzxMYlx.gif',
            'https://tenor.com/jIvtp9o3lhW.gif',
            'https://tenor.com/pp3g1CzVl9u.gif',
            'https://tenor.com/bWFDV.gif',
            'https://tenor.com/mJzjUsu6Kz8.gif'
        ];

        const video = videos[Math.floor(Math.random() * videos.length)];
        let mentions = [who];

        conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [who, m.sender]  
        }, { quoted: m });
    }
};

handler.help = ['kiss @tag'];
handler.tags = ['anime'];
handler.command = ['kiss', 'beso'];
handler.group = true;

export default handler;