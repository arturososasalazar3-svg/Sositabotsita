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
    m.react('🏳️‍🌈');

    let str;
        if (who !== m.sender) {
    str = `🏳️‍🌈 *@${name2}* le da un tierno beso a *@${name}* 🏳️‍🌈\n\n¡El amor no tiene límites! 🌈✨`;
} else if (m.quoted) {
    str = `🏳️‍🌈 *@${name2}* besa suavemente a *@${name}* 💞\n\nQué momento tan especial 😳💕`;
} else {
    str = `🏳️‍🌈 *@${name2}* lanza un beso para todos en el grupo 😘💫\n\n¡Mucho amor para todos ustedes! ❤️`;
}

    if (m.isGroup) {
        const videos = [
            'https://tenor.com/fJNEPAtrJrp.gif',
            'https://tenor.com/ubIQyKC54UK.gif',
            'https://tenor.com/maWYuaNkhQT.gif',
            'https://tenor.com/tMxW0VAB6MH.gif',
            'https://tenor.com/vTnLwmRCcIO.gif'
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

handler.help = ['kiss2 @tag'];
handler.tags = ['anime'];
handler.command = ['kiss2', 'beso2'];
handler.group = true;

export default handler;
