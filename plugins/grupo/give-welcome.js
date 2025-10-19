import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {


    let userJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;


    if (!userJid && m.quoted) {
        userJid = m.quoted.sender;
    }


    if (!userJid) {
        return conn.reply(m.chat, `Por favor, etiqueta al usuario al que le quieres dar la bienvenida con un @ o responde a uno de sus mensajes con el comando: ${usedPrefix}${command}`, m, fake);
    }


    const userName = conn.getName(userJid);

    const groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : '';

    const welcomeText = `*👋 ¡Bienvenido(a), @${userJid.split('@')[0]}!*
Te damos la bienvenida al grupo *${groupName}*.
Soy *${global.botname}*, tu bot en este grupo.

> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

    const imageUrl = global.icono

    const message = {
        image: { url: imageUrl },
        caption: welcomeText,
        mentions: [userJid]
    }

    await conn.sendMessage(m.chat, message)
}

handler.command = handler.help = ['bienvenido', 'bienvenida']
handler.tags = ['grupo']
handler.group = true
handler.botAdmin = false
handler.admin = false

export default handler