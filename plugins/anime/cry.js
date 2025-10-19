import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    let who
    let mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender

    if (mentionedJid) {
        who = mentionedJid
    } else if (m.quoted) {
        who = m.quoted.sender
    } else {
        who = m.sender
    }

    let name2 = m.sender.split('@')[0]
    let name = who.split('@')[0]

    m.react('😭')

    let str
    if (who !== m.sender) {
        str = `😭 *@${name2}* está llorando por *@${name}*`
    } else {
        str = `😭 *@${name2}* no puede parar de llorar... necesita consuelo`
    }

    if (m.isGroup) {
        const videos = [
            'https://tenor.com/bnvXcnHO843.gif',
            'https://tenor.com/nn0YjazkgaI.gif',
            'https://tenor.com/iRcD6J1H1lz.gif',
            'https://tenor.com/ckkl7QnHtg2.gif'
        ]

        const video = videos[Math.floor(Math.random() * videos.length)]

        conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [who, m.sender]
        }, { quoted: m })
    }
}

handler.help = ['llorar @tag', 'cry @tag']
handler.tags = ['anime']
handler.command = ['llorar', 'cry']
handler.group = true

export default handler