import axios from 'axios'
import FormData from 'form-data'
import { Buffer } from 'node:buffer'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        const q = m.quoted ? m.quoted : m
        const mime = (q.msg || q).mimetype || q.mediaType || ''

        if (!mime || !mime.startsWith('image/')) {
            return conn.reply(m.chat, `Envía o responde a una imagen con el comando:\n\n${usedPrefix + command} [method] [quality]\n\n*Methods:* 1, 2, 3, 4\n*Quality:* low, medium, high\n\nEjemplo: ${usedPrefix + command} 2 high`,)
        }

        const method = parseInt(args[0]) || 1
        const quality = args[1]?.toLowerCase() || 'medium'

        await conn.sendMessage(m.chat, { text: `⌛ Procesando imagen...` }, { quoted: m })

        const buffer = await q.download()
        const enhancedBuffer = await ihancer(buffer, { method, size: quality })

        await conn.sendMessage(m.chat, { 
            image: enhancedBuffer,
            caption: `✅ Imagen mejorada\n- Método: ${method}\n- Calidad: ${quality}`,
            fileName: 'enhanced.jpg'
        }, { quoted: m })        
    } catch (error) {
        console.error(error)
        conn.sendMessage(m.chat, { text: `❌ Error: ${error.message}` }, { quoted: m })
    }
}

handler.help = ['hd2']
handler.tags = ['ia']
handler.command = ['hd2'] 

export default handler

async function ihancer(buffer, { method = 1, size = 'low' } = {}) {
    const _size = ['low', 'medium', 'high']

    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Se requiere una imagen')
    if (method < 1 || method > 4) throw new Error('Métodos disponibles: 1, 2, 3, 4')
    if (!_size.includes(size)) throw new Error(`Calidades disponibles: ${_size.join(', ')}`)

    const form = new FormData()
    form.append('method', method.toString())
    form.append('is_pro_version', 'false')
    form.append('is_enhancing_more', 'false')
    form.append('max_image_size', size)
    form.append('file', buffer, `rynn_${Date.now()}.jpg`)

    const { data } = await axios.post('https://ihancer.com/api/enhance', form, {
        headers: {
            ...form.getHeaders(),
            'accept-encoding': 'gzip',
            'host': 'ihancer.com',
            'user-agent': 'Dart/3.5 (dart:io)'
        },
        responseType: 'arraybuffer'
    })

    return Buffer.from(data)
}