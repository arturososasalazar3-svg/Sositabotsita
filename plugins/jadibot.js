import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path' 
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner}) => {
const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)  
const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command)  
const isCommand3 = /^(bots|sockets|socket)$/i.test(command)   

async function reportError(e) {
await m.reply(`⚠️  [SYS-ERR] ${emoji} ${botname} detectó un error interno...`)
console.log(e)
}

switch (true) {       

case isCommand1:
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
const path = `./${jadi}/${uniqid}`

if (!await fs.existsSync(path)) {
await conn.sendMessage(m.chat, { 
  text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${emoji} Sesión no encontrada  
┃ ➜ Usa: ${usedPrefix}serbot
┃ ➜ O vincula con: ${usedPrefix}serbot (ID)
╰─╼━━━━━━━━━━╾─╯
${emoji} ${botname}
`.trim() }, { quoted: m })
return
}

if (global.conn.user.jid !== conn.user.jid) {
await conn.sendMessage(m.chat, { 
  text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${emoji} Este comando solo funciona  
┃ en el *Bot Principal*.  
┃  
┃ 🔗 [Conectar al Principal]  
┃ https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}
╰─╼━━━━━━━━━━╾─╯
${emoji} ${botname}
`.trim() }, { quoted: m })
} else {
await conn.sendMessage(m.chat, { 
  text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${emoji} Sub-Bot desconectado  
┃ Tu sesión fue eliminada  
╰─╼━━━━━━━━━━╾─╯
${emoji} ${botname}
`.trim() }, { quoted: m })
}

try {
fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true })
await conn.sendMessage(m.chat, { text : `
╭─╼━━━━━━━━━━╾─╮
┃ ${emoji} Limpieza completa  
┃ Rastros de sesión eliminados  
╰─╼━━━━━━━━━━╾─╯
${emoji} ${botname}
`.trim() }, { quoted: m })
} catch (e) {
reportError(e)
}  
break


case isCommand2:
if (global.conn.user.jid == conn.user.jid) {
conn.reply(m.chat, `
╭─╼━━━━━━━━━━╾─╮
┃ ${emoji} No eres SubBot  
┃ Conéctate desde el  
┃ Bot Principal para pausar  
╰─╼━━━━━━━━━━╾─╯
${emoji} ${botname}
`.trim(), m)
} else {
await conn.reply(m.chat, `
╭─╼━━━━━━━━━━╾─╮
┃ ${emoji} Sub-Bot detenido  
┃ Conexión finalizada  
╰─╼━━━━━━━━━━╾─╯
${emoji} ${botname}
`.trim(), m)
conn.ws.close()
}  
break


case isCommand3:
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

function convertirMsADiasHorasMinutosSegundos(ms) {
var segundos = Math.floor(ms / 1000);
var minutos = Math.floor(segundos / 60);
var horas = Math.floor(minutos / 60);
var días = Math.floor(horas / 24);
segundos %= 60;
minutos %= 60;
horas %= 24;
return `${días ? días+"d " : ""}${horas ? horas+"h " : ""}${minutos ? minutos+"m " : ""}${segundos ? segundos+"s" : ""}`;
}

const message = users.map((v, index) => `
╭─[ SubBot #${index + 1} ]─╮
┃ 📎 wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
┃ 👤 Usuario: ${v.user.name || 'Sub-Bot'}
┃ 🕑 Online: ${ v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}
╰─────────────────────╯`
).join('\n\n');

const responseMessage = `
╭─╼━━━━━━━━━━━━━━━━━━━━╾─╮
┃ ${emoji} PANEL DE SUB-BOTS ${emoji} 
┃ Conectados: ${users.length || '0'}  
╰─╼━━━━━━━━━━━━━━━━━━━━╾─╯

${message || '🚫 No hay SubBots activos'}

${emoji} ${botname}
`.trim();

await _envio.sendMessage(m.chat, {text: responseMessage, mentions: _envio.parseMention(responseMessage)}, {quoted: m})
break   
}}

handler.tags = ['serbot']
handler.help = ['sockets', 'deletesesion', 'pausarai']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket']

export default handler