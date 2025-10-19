import { getUrlFromDirectPath } from "@whiskeysockets/baileys";
import _ from "lodash";
import axios from 'axios';

let handler = async (m, { conn, command, usedPrefix, args, text, groupMetadata, isOwner, isROwner }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1];
let thumb = m.pp
let pp, ch, q, mime, buffer, media, inviteUrlch, imageBuffer;

let inviteCode
if (!text) return await m.reply(`*⚠️ Ingrese un enlace de un grupo/comunidad/canal de WhatsApp para obtener información.*`)
const MetadataGroupInfo = async (res) => {
let groupPicture = "No se pudo obtener"
pp = await conn.profilePictureUrl(res.id, 'image').catch(e => { return null })
inviteCode = await conn.groupInviteCode(m.chat).catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.filter(user => user.admin === "admin" || user.admin === "superadmin").map((user, i) => ` • @${user.id.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : " (admin)"}`).join("\n")
: "No encontrado"
let caption = `
🌐 *ＩＮＳＰＥＣＴＯＲ ＤＥ ＧＲＵＰＯ*

*──────────────*

✨ *Nombre:*
${res.subject || "No encontrado"}

👑 *Creado por:*
@${res.owner.split("@")[0]} el ${formatDate(res.creation)}

👥 *Miembros Totales:* ${res.size || "No encontrado"}

🛡️ *Administradores:*
${formatParticipants(res.participants)}

📄 *Descripción:*
${res.desc || "No encontrada"}

*──────────────*

🔗 *Código de Invitación:* ${res.inviteCode || inviteCode || "No disponible"}
🔒 *Restricciones:* ${res.restrict ? "✅ Activadas" : "❌ Desactivadas"}
🗣️ *Anuncios:* ${res.announce ? "✅ Solo admins" : "❌ Todos pueden enviar"}
`.trim()
return caption
}

const inviteGroupInfo = async (groupData) => {
const { id, subject, size, creation, owner, desc, linkedParent, announce, isCommunity, joinApprovalMode, participants } = groupData
let groupPicture = "No se pudo obtener"
pp = await conn.profilePictureUrl(id, 'image').catch(e => { return null })
const formatParticipants = (participants) =>
participants && participants.length > 0
? participants.map((user, i) => ` • @${user.id.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n")
: "No encontrado"
let caption = `
🌐 *ＩＮＳＰＥＣＴＯＲ ＤＥ ＧＲＵＰＯ*

*──────────────*

✨ *Nombre:*
${subject || "No encontrado"}

👑 *Creado por:*
@${owner.split("@")[0]} el ${formatDate(creation)}

👥 *Miembros Totales:* ${size || "No encontrado"}

🏆 *Miembros Destacados:*
${formatParticipants(participants)}

📄 *Descripción:*
${desc || "No encontrada"}

*──────────────*

🏘️ *¿Es Comunidad?* ${isCommunity ? "✅ Sí" : "❌ No"}
🔗 *Comunidad Vinculada:* ${linkedParent || "Ninguna"}
🗣️ *Anuncios:* ${announce ? "✅ Solo admins" : "❌ Todos pueden enviar"}
`.trim()
return caption
}

let info
let finalID
const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]

if (m.chat.endsWith("@g.us") && !text) {
    try {
        let res = await conn.groupMetadata(m.chat)
        info = await MetadataGroupInfo(res) 
        finalID = res.id
    } catch (e) {
        console.error("Error al obtener MetadataGroupInfo:", e)
    }
} else if (inviteUrl) {
    try {
        let inviteInfo = await conn.groupGetInviteInfo(inviteUrl)
        info = await inviteGroupInfo(inviteInfo) 
        finalID = inviteInfo.id
    } catch (e) {
        m.reply('*❌ Enlace no válido.* Verifique que sea un enlace de grupo/comunidad activo.')
        return
    }
}

if (info) {
    await conn.sendMessage(m.chat, { text: info, contextInfo: {
    mentionedJid: [
        ...(m.sender ? [m.sender] : []),
        ...(groupMetadata?.owner ? [groupMetadata.owner] : []),
    ].filter(Boolean),
    externalAdReply: {
    title: "🔰 Inspector de Grupos",
    body: m.pushName,
    thumbnailUrl: pp || thumb,
    sourceUrl: args[0] ? args[0] : inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : md,
    mediaType: 1,
    showAdAttribution: false,
    renderLargerThumbnail: true
    }}}, { quoted: fkontak })
    if (finalID) conn.reply(m.chat, `${finalID}`, null)

} else {
    let newsletterInfo
    if (!channelUrl) return await conn.reply(m.chat, "*⚠️ Enlace no reconocido.* Debe ser un enlace de grupo, comunidad o canal de WhatsApp.", m)
    if (channelUrl) {
    try {
        newsletterInfo = await conn.newsletterMetadata("invite", channelUrl).catch(e => { return null })
        if (!newsletterInfo) return await conn.reply(m.chat, "*No se encontró información del canal.* Verifique que el enlace sea correcto.", m)       
        let caption = "*📢 Inspector de Canales*\n\n" + processObject(newsletterInfo, "", newsletterInfo?.preview)
        if (newsletterInfo?.preview) {
        pp = getUrlFromDirectPath(newsletterInfo.preview)
        } else {
        pp = thumb
        }
        await conn.sendMessage(m.chat, { text: caption, contextInfo: {
        mentionedJid: null,
        externalAdReply: {
        title: "📢 Inspector de Canales",
        body: m.pushName,
        thumbnailUrl: pp || thumb,
        sourceUrl: args[0],
        mediaType: 1,
        showAdAttribution: false,
        renderLargerThumbnail: true
        }}}, { quoted: fkontak })
        if (newsletterInfo.id) conn.reply(m.chat, `${newsletterInfo.id}`, null)
    } catch (e) {
        console.log(e)
    }}}
}

handler.help = ["superinspect", "inspect"]
handler.tags = ['tools'];
handler.command = /^(superinspect|inspect|revisar|inspeccionar)$/i;

export default handler;

function formatDate(n, locale = "es", includeTime = false) {
if (n > 1e12) {
n = Math.floor(n / 1000)
} else if (n < 1e10) {
n = Math.floor(n * 1000)
}
const date = new Date(n)
if (isNaN(date)) return "Fecha no válida"
const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' }
const formattedDate = date.toLocaleDateString(locale, optionsDate)
if (!includeTime) return formattedDate
const hours = String(date.getHours()).padStart(2, '0')
const minutes = String(date.getMinutes()).padStart(2, '0')
const seconds = String(date.getSeconds()).padStart(2, '0')
const period = hours < 12 ? 'AM' : 'PM'
const formattedTime = `${hours}:${minutes}:${seconds} ${period}`
return `${formattedDate}, ${formattedTime}`
}

function formatValue(key, value, preview) {
switch (key) {
case "subscribers":
return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "No hay suscriptores"
case "creation_time":
case "nameTime":
case "descriptionTime":
return formatDate(value)
case "description": 
case "name":
return value || "No hay información disponible"
case "state":
switch (value) {
case "ACTIVE": return "Activo"
case "GEOSUSPENDED": return "Suspendido por región"
case "SUSPENDED": return "Suspendido"
default: return "Desconocido"
}
case "reaction_codes":
switch (value) {
case "ALL": return "Todas las reacciones permitidas"
case "BASIC": return "Reacciones básicas permitidas"
case "NONE": return "No se permiten reacciones"
default: return "Desconocido"
}
case "verification":
switch (value) {
case "VERIFIED": return "Verificado"
case "UNVERIFIED": return "No verificado"
default: return "Desconocido"
}
case "mute":
switch (value) {
case "ON": return "Silenciado"
case "OFF": return "No silenciado"
case "UNDEFINED": return "Sin definir"
default: return "Desconocido"
}
case "view_role":
switch (value) {
case "ADMIN": return "Administrador"
case "OWNER": return "Propietario"
case "SUBSCRIBER": return "Suscriptor"
case "GUEST": return "Invitado"
default: return "Desconocido"
}
case "picture":
if (preview) {
return getUrlFromDirectPath(preview)
} else {
return "No hay imagen disponible"
}
default:
return value !== null && value !== undefined ? value.toString() : "No hay información disponible"
}}

function newsletterKey(key) {
return _.startCase(key.replace(/_/g, " "))
.replace("Id", "🆔 Identificador")
.replace("State", "📌 Estado")
.replace("Creation Time", "📅 Fecha de creación")
.replace("Name Time", "✏️ Fecha de modificación del nombre")
.replace("Name", "🏷️ Nombre")
.replace("Description Time", "📝 Fecha de modificación de la descripción")
.replace("Description", "📜 Descripción")
.replace("Invite", "📩 Invitación")
.replace("Handle", "👤 Alias")
.replace("Picture", "🖼️ Imagen")
.replace("Preview", "👀 Vista previa")
.replace("Reaction Codes", "😃 Reacciones")
.replace("Subscribers", "👥 Suscriptores")
.replace("Verification", "✅ Verificación")
.replace("Viewer Metadata", "🔍 Datos avanzados")
}

function processObject(obj, prefix = "", preview) {
let caption = ""
Object.keys(obj).forEach(key => {
const value = obj[key]
if (typeof value === "object" && value !== null) {
if (Object.keys(value).length > 0) {
const sectionName = newsletterKey(prefix + key)
caption += `\n*\`${sectionName}\`*\n`
caption += processObject(value, `${prefix}${key}_`)
}} else {
const shortKey = prefix ? prefix.split("_").pop() + "_" + key : key
const displayValue = formatValue(shortKey, value, preview)
const translatedKey = newsletterKey(shortKey)
caption += `- *${translatedKey}:*\n${displayValue}\n\n`
}})
return caption.trim()
}
