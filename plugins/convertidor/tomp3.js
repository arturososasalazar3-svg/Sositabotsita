import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function toAudio(buffer, ext) {
    const tmp = path.join(tmpdir(), `tmp.${ext}`);
    const out = path.join(tmpdir(), `out.mp3`);
    fs.writeFileSync(tmp, buffer);
    return new Promise((resolve, reject) => {
        spawn('ffmpeg', [
            '-i', tmp,
            '-q:a', '0',
            '-map', 'a',
            out
        ]).on('error', reject).on('close', (code) => {
            fs.unlinkSync(tmp);
            if (code !== 0) return reject(code);
            const data = fs.readFileSync(out);
            fs.unlinkSync(out);
            resolve({
                data,
                filename: 'audio.mp3',
                mimetype: 'audio/mpeg'
            });
        });
    });
}

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        await m.react('🕒');
        conn.sendPresenceUpdate('composing', m.chat);

        const res = await fetch('https://i.postimg.cc/pdCvMMvP/1755841606616.jpg');
        const thumb3 = Buffer.from(await res.arrayBuffer());

        let fkontak = {
            key: {
                fromMe: false,
                remoteJid: "120363368035542631@g.us",
                participant: m.sender
            },
            message: {
                imageMessage: {
                    mimetype: 'image/jpeg',
                    caption: '𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢 𝗔 ☆ 𝗠𝗣3',
                    jpegThumbnail: thumb3
                }
            }
        };
        const q = m.quoted ? m.quoted : m;
        const mime = (q || q.msg).mimetype || q.mediaType || '';

        if (!/video|audio/.test(mime)) {
            return conn.reply(m.chat, `Por favor, responda al video o nota de voz que desee convertir a Audio/MP3.`, m);
        }

        const media = await q.download();
        if (!media) {
            return conn.reply(m.chat, '⚠️ Ocurrió un error al descargar su video.', m);
        }

        const audio = await toAudio(media, 'mp4');
        if (!audio.data) {
            return conn.reply(m.chat, '⚠️ Ocurrió un error al convertir su nota de voz a Audio/MP3.', m);
        }

        conn.sendMessage(m.chat, { audio: audio.data, mimetype: 'audio/mpeg' }, { quoted: fkontak });
    } catch (err) {
        await m.react('✖️');
        console.error(err);
        conn.reply(m.chat, '🚩 *Ocurrió un fallo al convertir el video/audio.*', m);
    }
};

handler.help = ['tomp3', 'toaudio'];
handler.command = ['tomp3', 'toaudio'];
handler.group = true;

export default handler;
