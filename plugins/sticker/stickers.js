import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png, webp2mp4 } from '../../lib/webp2mp4.js'
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'

const tmp = ext => path.join(tmpdir(), `${Date.now()}.${ext}`)

let handler = async (m, { conn, args, command }) => {
const res = await fetch('https://files.catbox.moe/p87uei.jpg')
const thumb = Buffer.from(await res.arrayBuffer())
let user = m.sender
const fkontak = { key:{fromMe:false,participant:user},message:{imageMessage:{jpegThumbnail:thumb,caption:'✨ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 ✨'}}}
const fkontak2 = { key:{fromMe:false,participant:user},message:{imageMessage:{jpegThumbnail:thumb,caption:'⚠︎ 𝗘𝗥𝗥𝗢𝗥 ⚠︎'}}}

const formasValidas = ['co', 'ci', 'sq', 'no', 'rd', 'di', 'tr', 'st', 'he', 'pe', 'el', 're', 'cr', 'ar', 'pl', 'ro', 'la']
let texto = args.filter(a=>!formasValidas.includes(a.toLowerCase())).join(' ').trim()
let forma = (args.find(a=>formasValidas.includes(a.toLowerCase()))||'').toLowerCase()
let stiker = false
let rcanal = global.rcanal || {}

const mensajeUso = `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ʀᴇsᴘᴏɴᴅᴇ ᴏ ᴇɴᴠÍᴀ ᴜɴᴀ *ɪᴍᴀɢᴇɴ, ᴠɪᴅᴇᴏ ᴏ ɢɪғ* ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.

---
*==> Formas de Imagen (Opcional):*
- /${command} *ci* => Círculo
- /${command} *co* => Corazón
- /${command} *st* => Estrella ⭐
- /${command} *di* => Rombo
- /${command} *tr* => Triángulo
- /${command} *he* => Hexágono
- /${command} *pe* => Pentágono
- /${command} *el* => Elipse
- /${command} *ro* => Rosa / Trébol
- /${command} *la* => Lágrima / Gota
- /${command} *rd* => Redondeado (Esquinas)
- /${command} *re* => Rectángulo Redondeado
- /${command} *cr* => Cruz
- /${command} *pl* => Plus (+)
- /${command} *sq* => Cuadrado (Recortar a 1:1)
- /${command} *no* => Normalizar (Ajustar al Cuadrado)

---
*==> Puedes agregar texto:*
- /${command} [forma] [texto corto]
- Ej: /${command} *ro* ¡Te Amo!
- Ej: /${command} ¡Animado!`

try {
let q = m.quoted ? m.quoted : m
let mime = q.mimetype || q.msg?.mimetype || q.message?.imageMessage?.mimetype || q.message?.videoMessage?.mimetype || q.message?.stickerMessage?.mimetype || ''
let media

if (!/video|gif|webp|image/.test(mime)) return conn.reply(m.chat, mensajeUso, m, rcanal)

    await m.react('⌛')
if (/video|gif/.test(mime)) {
if (q.seconds > 15) return conn.reply(m.chat, '⚠️ El video/gif es muy largo. Máximo 15 segundos para animado.', fkontak2)
let img = await q.download?.()
if (!img) return conn.reply(m.chat, '⚠️ No se pudo descargar el video o gif.', fkontak2)

try {
stiker = await sticker(img, false, global.packsticker, global.packsticker2)
} catch (e) {
console.error('Error en conversión directa de video:', e)
}

if (!stiker) {
let out = await uploadFile(img)
if (typeof out !== 'string') out = await uploadImage(img)
stiker = await sticker(false, out, global.packsticker, global.packsticker2)
}

} else if (/webp|image/.test(mime)) {
let img = await q.download?.()
if (!img) return conn.reply(m.chat, `⚠️ No se pudo descargar la imagen/sticker.`, fkontak2)
let jimg = await Jimp.read(img)
let { width, height } = jimg.bitmap
let size = 512

if (forma === 'sq') {
let min = Math.min(width, height)
jimg.crop(Math.floor((width - min) / 2), Math.floor((height - min) / 2), min, min).resize(size, size)
} else if (forma === 'no') {
jimg.contain(size, size)
} else {
jimg.resize(size, size)
}

width = jimg.bitmap.width
height = jimg.bitmap.height

if (formasValidas.includes(forma) && forma !== 'no' && forma !== 'sq') {
const mask = new Jimp(width, height, '#00000000')
mask.scan(0, 0, width, height, function (x, y, idx) {
const dx = x - width / 2
const dy = y - height / 2
const r = Math.hypot(dx, dy)
const radius = width / 2
const nx = dx / radius
const ny = dy / radius
let pass = false

switch (forma) {
case 'ci':
pass = r < radius
break
case 'el':
const a = radius
const b = radius 
pass = (dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1
break
case 'co':
const scaleX = 1.25
const scaleY = 1.35
const offsetY = 0.05
const nxx = dx / radius * scaleX
const nyy = -dy / radius * scaleY - offsetY
const eq = Math.pow(nxx * nxx + nyy * nyy - 1, 3) - nxx * nxx * nyy * nyy * nyy
pass = eq <= 0
break
case 'di':
pass = Math.abs(nx) + Math.abs(ny) < 1.0
break
case 'tr':
pass = y > height - height * (1 - Math.abs(dx) / radius)
break
case 'st':
const numPoints = 5
const innerRadius = 0.4
const rot = -Math.PI / 2
const angle = Math.atan2(dy, dx)
const distance = r / radius
const k = Math.PI * 2 / numPoints
const starAngle = (angle - rot + Math.PI * 2) % (Math.PI * 2)
const angleInSector = Math.abs(starAngle % k - k / 2)
const starFactor = Math.cos(k / 2) / Math.cos(angleInSector)
const currentRadius = innerRadius / starFactor
pass = distance <= currentRadius
break
case 'he':
const a_hex = radius
const b_hex = a_hex * Math.sqrt(3) / 2
pass = Math.abs(dy) <= a_hex && Math.abs(dx) <= b_hex && a_hex * Math.abs(dx) + b_hex * Math.abs(dy) <= a_hex * b_hex
break
case 'pe':
const sides = 5
const rot_pe = -Math.PI / 2
const a_pe = Math.atan2(dy, dx) + rot_pe
const dist_pe = r
const k_pe = 2 * Math.PI / sides
const angle_pe = Math.min(Math.abs(a_pe % k_pe), Math.abs((a_pe % k_pe) - k_pe))
pass = dist_pe * Math.cos(angle_pe) <= radius * Math.cos(Math.PI / sides)
break
case 'ro':
const n = 5
const k_ro = n 
const angle_ro = Math.atan2(dy, dx)
const r_ro = Math.cos(k_ro * angle_ro)
pass = r / radius <= Math.pow(r_ro * r_ro, 1 / (2 * k_ro))
break
case 'la':
const angle_la = Math.atan2(dy, dx)
const r_la = 2 * Math.pow(Math.sin(angle_la / 2), 2)
pass = r / radius <= r_la
break
case 're':
const rectWidth = width
const rectHeight = height * 0.75
const rectY = (height - rectHeight) / 2
const rectX = 0
const radius_re = 50
const isInsideRect = x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight
const checkCorner = (cx, cy) => {
if (Math.hypot(x - cx, y - cy) <= radius_re) return true
return false
}
if (isInsideRect) {
if (x < rectX + radius_re && y < rectY + radius_re) pass = checkCorner(rectX + radius_re, rectY + radius_re)
else if (x > rectX + rectWidth - radius_re && y < rectY + radius_re) pass = checkCorner(rectX + rectWidth - radius_re, rectY + radius_re)
else if (x < rectX + radius_re && y > rectY + rectHeight - radius_re) pass = checkCorner(rectX + radius_re, rectY + rectHeight - radius_re)
else if (x > rectX + rectWidth - radius_re && y > rectY + rectHeight - radius_re) pass = checkCorner(rectX + rectWidth - radius_re, rectY + rectHeight - radius_re)
else pass = true
}
break
case 'cr':
const barWidth = width * 0.2
pass = (Math.abs(dx) <= barWidth && Math.abs(dy) <= width / 2) || (Math.abs(dy) <= barWidth && Math.abs(dx) <= width / 2)
break
case 'pl':
const plusWidth = width * 0.15
pass = (Math.abs(dx) <= plusWidth && Math.abs(dy) <= width / 2) || (Math.abs(dy) <= plusWidth && Math.abs(dx) <= width / 2)
break
case 'ar':
pass = r < radius && dy > 0
break
case 'rd':
const cornerRadius = 60
const d = Math.min(cornerRadius, radius)
const x1 = d
const x2 = width - d
const y1 = d
const y2 = height - d
if (x < x1 && y < y1) pass = Math.hypot(x - x1, y - y1) <= d
else if (x > x2 && y < y1) pass = Math.hypot(x - x2, y - y1) <= d
else if (x < x1 && y > y2) pass = Math.hypot(x - x1, y - y2) <= d
else if (x > x2 && y > y2) pass = Math.hypot(x - x2, y - y2) <= d
else if (x >= x1 && x <= x2 && y >= 0 && y <= height) pass = true
else if (y >= y1 && y <= y2 && x >= 0 && x <= width) pass = true
break
default:
pass = true
}

if (pass) {
this.bitmap.data[idx + 0] = 255
this.bitmap.data[idx + 1] = 255
this.bitmap.data[idx + 2] = 255
this.bitmap.data[idx + 3] = 255
}
})
jimg.mask(mask, 0, 0)
}

if (texto) {
const brillo = jimg.bitmap.data.reduce((a, _, i) => i % 4 !== 3 ? a + jimg.bitmap.data[i] : a, 0) / (width * height * 3)
const color = brillo > 127 ? '#000000' : '#FFFFFF'
const fuente = await Jimp.loadFont(color === '#000000' ? Jimp.FONT_SANS_64_BLACK : Jimp.FONT_SANS_64_WHITE)
const sombra = await Jimp.loadFont(color === '#000000' ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_64_BLACK)
jimg.print(sombra, 3, -3, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
jimg.print(fuente, 0, 0, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
}

img = await jimg.getBufferAsync(Jimp.MIME_PNG)
stiker = await sticker(img, false, global.packsticker, global.packsticker2)
}

if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...rcanal }, { quoted: fkontak })
else conn.reply(m.chat, mensajeUso, m, rcanal)
} catch (e) {
console.error(e)
return conn.reply(m.chat, `⚠️ Ocurrió un error al procesar el sticker: ${e.message || 'Desconocido'}`, fkontak2)
    await m.react('👑')
}
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler
