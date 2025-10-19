import axios from 'axios';
import { URL } from 'url';

let handler = async (m, { conn, text, usedPrefix, command }) => {


    if (!text) {
        return m.reply(`${emoji2} Por favor, ingresa un enlace de *Terabox*.`);
    }

    try {
        new URL(text);
    } catch (e) {
        return m.reply(`${emoji2} Por favor, ingresa una URL válida.`);
    }

    await m.react('🕓');

    try {
        const result = await terabox(text);
        if (!result.length) {
            return m.reply(`${emoji2} No se encontraron archivos para descargar en el enlace proporcionado.`);
        }

        for (let i = 0; i < result.length; i++) {
            const { fileName, type, thumb, url } = result[i];

            if (!fileName || !url) {
                console.error('Error: Datos del archivo incompletos', { fileName, url });
                continue;
            }

            const caption = `
┏━━━━━━━━━━━━━━━━⌼
┇ *Nombre File:* ${fileName}
┇ *Formato:* ${type}
┇ URL: ${url}
┗━━━━━━━━━━━━━━━━⍰
`;

            try {
                await conn.sendFile(m.chat, url, fileName, caption, m, false, {
                    thumbnail: thumb ? await getBuffer(thumb) : null
                });
                await m.react(emoji);
            } catch (error) {
                console.error('Error al enviar el archivo:', error);
                m.reply(`${emoji2} Error al enviar el archivo: ${fileName}`);
            }
        }
    } catch (err) {
        console.error('Error general:', err.message);
        m.reply(`${emoji2} Ocurrió un error al descargar el archivo.`);
    }
};

handler.help = ["terabox *<url>*"];
handler.tags = ["dl"];
handler.command = ['terabox', 'tb'];
handler.group = true;
handler.register = true;
handler.coin = 5;

export default handler;

async function terabox(url) {
    const fileDataResponse = await axios.get(`https://api.dapuhy.my.id/api/downloader/terabox?url=${url}`);
    const data = fileDataResponse.data;

    if (data.status !== 200 || !data.result || data.result.length === 0) {
        throw new Error('No se encontraron archivos en el enlace de Terabox.');
    }

    const files = [];

    for (const file of data.result) {
        if (file.url) {
            files.push({
                fileName: file.fileName || 'desconocido',
                type: file.fileType || 'desconocido',
                thumb: file.thumb || null,
                url: file.url
            });
        }
    }

    return files;
}

async function getBuffer(url) {
    try {
        const res = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (err) {
        console.error('Error al obtener el buffer:', err);
        return null;
    }
}