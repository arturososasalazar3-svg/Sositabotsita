import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🕒');
        conn.sendPresenceUpdate('composing', m.chat);

        const pluginsDir = './plugins';
        let response = `📂 *Revisión de Syntax Errors:*\n\n`;
        let hasErrors = false;

        async function checkRecursive(dir) {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stats = fs.statSync(fullPath);

                if (stats.isDirectory()) {
                    await checkRecursive(fullPath); // Llamada recursiva para subcarpetas
                } else if (item.endsWith('.js')) {
                    try {
                        await import(path.resolve(fullPath));
                    } catch (error) {
                        hasErrors = true;
                        response += `🚩 *Error en:* ${fullPath.replace(pluginsDir + '/', '')}\n${error.message}\n\n`;
                    }
                }
            }
        }

        await checkRecursive(pluginsDir);

        if (!hasErrors) {
            response += '✅ ¡Todo está en orden! No se detectaron errores de sintaxis.';
        }

        await conn.reply(m.chat, response, m);
        await m.react('✅');
    } catch (err) {
        await m.react('✖️');
        console.error(err);
        conn.reply(m.chat, '🚩 *Ocurrió un fallo al verificar los plugins.*', m);
    }
};

handler.command = ['errores'];
handler.help = ['rev'];
handler.tags = ['tools'];

export default handler;