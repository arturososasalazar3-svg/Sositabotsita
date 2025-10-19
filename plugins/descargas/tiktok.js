import fetch from "node-fetch"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`${emoji} Ingresa un enlace de TikTok.`)
  try {
    let res = await fetch(`https://g-mini-ia.vercel.app/api/tiktok?url=${encodeURIComponent(args[0])}&apikey=by_deylin`)
    if (!res.ok) throw await res.text()
    let data = await res.json()

    let txt = `
𝗧𝗜𝗞-𝗧𝗢𝗞 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦

*𝘮𝘦𝘯𝘶 𝘥𝘦 𝘰𝘱𝘤𝘪𝘰𝘯𝘦𝘴*

🗣️ Title » ${data.title || "TikTok Video"}  

*➔ Responde con el número para descargar:*

① ⇶Vídeo sin marca de agua 📽️  
② ⇶Sólo audio 🎵  
③ ⇶Nota de vídeo 🕳️
`.trim()

    let sentMsg = await conn.sendMessage(m.chat, {
      image: { url: data.thumbnail },
      caption: txt,
      ...global.rcanal
    }, { quoted: m })

    conn.tiktokMenu = conn.tiktokMenu || {}
    conn.tiktokMenu[sentMsg.key.id] = data
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al obtener el video de TikTok.")
  }
}

handler.help = ['tiktok/tt <URL>'];
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];

let before = async (m, { conn }) => {
  if (!m.quoted || !conn.tiktokMenu) return
  let msgId = m.quoted.id || m.quoted.key?.id
  let data = conn.tiktokMenu[msgId]
  if (!data) return

  let choice = m.text.trim()
  if (!["1", "2", "3"].includes(choice)) return

  try {
    switch (choice) {
      case "1":
       // await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(m.chat, { video: { url: data.video_url }, caption: "🎬 TikTok sin marca de agua" }, { quoted: m })
        break
      case "2":
       // await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(m.chat, { audio: { url: data.audio_url || data.video_url }, mimetype: "audio/mpeg", fileName: "tiktok.mp3" }, { quoted: m })
        break
      case "3":
        //await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(m.chat, { 
          video: { url: data.video_url }, 
          mimetype: "video/mp4", 
          ptv: true
        }, { quoted: m })
        break
    }
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al enviar el archivo.")
  }
}

handler.before = before
export default handler