let linkRegex = /https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text, isOwner }) => {
    if (!text) return m.reply(`${emojis} Debes enviar una invitación para que *${botname}* se una al grupo.`);

    let match = text.match(linkRegex);
    if (!match) return m.reply(`${emojis} Enlace de invitación no válido.`);

    let [, code] = match;

    if (isOwner) {
        try {
const res = await fetch('https://i.postimg.cc/HLj8Shst/1757398147482.jpg');
const img = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: botname,
                description: botname,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};
            let groupId = await conn.groupAcceptInvite(code);
            m.reply(`${emojis} Me he unido exitosamente al grupo.`);


            await conn.sendMessage(groupId, { text: `Hola, soy ${botname}` }, { quoted: fkontak });

        } catch (err) {
            console.error('[ERROR AL UNIRSE AL GRUPO]', err);
            let msg = `${msm} Error al unirme al grupo.`;

            if (err?.message?.includes('not-authorized')) {
                msg += `\nPosiblemente el número fue expulsado del grupo anteriormente.`;
            } else if (err?.message?.includes('already joined')) {
                msg += `\nYa estoy en ese grupo.`;
            } else if (err?.message?.includes('invalid')) {
                msg += `\nEl enlace de invitación no es válido o está vencido.`;
            }

            m.reply(msg);
        }
    } else {
        let message = `${emojis} Invitación a un grupo:\n${text}\n\nPor: @${m.sender.split('@')[0]}`;
        await conn.sendMessage(`${suittag}@s.whatsapp.net`, { text: message, mentions: [m.sender] }, { quoted: m });
        m.reply(`${emoji} El link del grupo ha sido enviado, gracias por tu invitación. ฅ^•ﻌ•^ฅ`);
    }
};

handler.help = ['invite'];
handler.tags = ['owner', 'tools'];
handler.command = ['invite', 'join2'];
handler.rowner = true;

export default handler;