let cierresProgramados = {};
let aperturasProgramadas = {};
import { parse } from 'path';

function parseTiempo(entrada) {
    entrada = entrada.toLowerCase().replace(/\s/g, '');

    if (/^\d{1,2}:\d{2}(am|pm)$/.test(entrada)) {
        let [, horasStr, minutosStr, periodo] = entrada.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
        let horas = parseInt(horasStr);
        let minutos = parseInt(minutosStr);

        if (periodo === 'pm' && horas < 12) horas += 12;
        if (periodo === 'am' && horas === 12) horas = 0;

        const ahora = new Date();
        const objetivo = new Date();
        objetivo.setHours(horas);
        objetivo.setMinutes(minutos);
        objetivo.setSeconds(0);

        if (objetivo <= ahora) objetivo.setDate(objetivo.getDate() + 1);
        return objetivo.getTime() - ahora.getTime();
    }

    if (/^\d+h$/.test(entrada)) return parseInt(entrada) * 60 * 60 * 1000;
    if (/^\d+m$/.test(entrada)) return parseInt(entrada) * 60 * 1000;

    return null;
}

let handler = async (m, { conn, args, command, isAdmin, isBotAdmin }) => {
    if (!m.isGroup) return m.reply('⛔ Este comando solo funciona en grupos.');
    if (!isAdmin) return m.reply('⛔ Solo los administradores pueden usar este comando.');
    if (!isBotAdmin) return m.reply('⛔ El bot necesita ser administrador para ejecutar esto.');

    if (!args[0]) {
        return m.reply(`⏰ Uso correcto:
.cerrargrupo 07:00pm
.abrirgrupo 08:00am
.cerrargrupo 1h
.abrirgrupo 30m`);
    }

    let tiempoMs = parseTiempo(args[0]);
    if (tiempoMs === null) return m.reply('⛔ Formato inválido. Usa por ejemplo: 07:00am, 1h, 30m');

    let chatId = m.chat;

    if (command === 'cerrargrupo') {
        if (cierresProgramados[chatId]) clearTimeout(cierresProgramados[chatId]);

        cierresProgramados[chatId] = setTimeout(async () => {
            await conn.groupSettingUpdate(chatId, 'announcement');
            await conn.sendMessage(chatId, {
                text: `🔒 *Grupo cerrado automáticamente.*\nAhora solo los administradores pueden enviar mensajes.`
            });
            delete cierresProgramados[chatId];
        }, tiempoMs);

        let minutos = Math.floor(tiempoMs / 60000);
        return m.reply(`✅ El grupo se cerrará automáticamente en *${minutos} minuto(s).*`);
    }

    if (command === 'abrirgrupo') {
        if (aperturasProgramadas[chatId]) clearTimeout(aperturasProgramadas[chatId]);

        aperturasProgramadas[chatId] = setTimeout(async () => {
            await conn.groupSettingUpdate(chatId, 'not_announcement');
            await conn.sendMessage(chatId, {
                text: `🔓 *Grupo abierto automáticamente.*\nTodos los miembros pueden enviar mensajes.`
            });
            delete aperturasProgramadas[chatId];
        }, tiempoMs);

        let minutos = Math.floor(tiempoMs / 60000);
        return m.reply(`✅ El grupo se abrirá automáticamente en *${minutos} minuto(s).*`);
    }
};

handler.help = ['cerrargrupo <hora|1h|30m>', 'abrirgrupo <hora|1h|30m>'];
handler.tags = ['grupo'];
handler.command = ['cerrargrupo', 'abrirgrupo'];
handler.admin = true;
handler.group = true;

export default handler;