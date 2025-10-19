let recordatorios = {};
import fetch from 'node-fetch';

async function handler(m, { args, command, conn, participants }) {
    const chatId = m.chat;

    const res = await fetch('https://files.catbox.moe/nwgsz3.jpg');
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
                name: ' 𝗥𝗘𝗖𝗢𝗥𝗗𝗔𝗧𝗢𝗥𝗜𝗢',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    if (command === 'recordatorio') {
        if (args.length < 3) return m.reply('Uso: *!recordatorio [minutos] [veces] [mensaje]*');

        let tiempo = parseInt(args[0]);
        let repeticiones = parseInt(args[1]);
        if (isNaN(tiempo) || tiempo <= 0) return m.reply('⛔ El tiempo debe ser un número válido en minutos.');
        if (isNaN(repeticiones) || repeticiones <= 0) return m.reply('⛔ Las veces deben ser un número válido mayor a 0.');

        let mensaje = args.slice(2).join(' ');

        if (recordatorios[chatId]) clearTimeout(recordatorios[chatId].timeout);

        let contador = 0;
        function enviarRecordatorio() {
            if (contador < repeticiones) {
                let mencionados = participants.map(u => u.id);
                conn.sendMessage(chatId, {
                    text: `${mensaje}`,
                    mentions: mencionados
                }, { quoted: fkontak });
                contador++;
                recordatorios[chatId].timeout = setTimeout(enviarRecordatorio, tiempo * 60000);
            } else {
                delete recordatorios[chatId];
            }
        }

        recordatorios[chatId] = { timeout: setTimeout(enviarRecordatorio, tiempo * 60000) };
        m.reply(`✅ Recordatorio activado: *"${mensaje}"* cada ${tiempo} minuto(s), se enviará ${repeticiones} veces.`);
    }

    if (command === 'cancelarrecordatorio') {
        if (recordatorios[chatId]) {
            clearTimeout(recordatorios[chatId].timeout);
            delete recordatorios[chatId];
            m.reply('❌ Recordatorio cancelado.');
        } else {
            m.reply('No hay recordatorios activos en este grupo.');
        }
    }
}

handler.help = ['recordatorio', 'cancelarrecordatorio'];
handler.tags = ['grupo'];
handler.command = ['recordatorio', 'cancelarrecordatorio'];
handler.admin = true;
handler.group = true;

export default handler;