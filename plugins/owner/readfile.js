import fs from "fs"
import path from "path"

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`${emoji} Debes especificar la ruta de un archivo.\n\nEjemplo: /readfile ./src/database/sent_welcome.json`)

  try {
    const filePath = text.trim()
    if (!fs.existsSync(filePath)) return m.reply("❌ El archivo no existe en la ruta especificada.")

    const ext = path.extname(filePath).toLowerCase()
    const mime = ext === ".jpg" || ext === ".jpeg" || ext === ".png" ? "image" :
                 ext === ".mp4" || ext === ".mov" || ext === ".mkv" ? "video" : "text"

    if (mime === "text") {
      const data = fs.readFileSync(filePath, "utf-8")
      await m.reply("📂 *Contenido del archivo*:\n\n" + data)
    } else {
      const buffer = fs.readFileSync(filePath)
      if (mime === "image") {
        await conn.sendMessage(m.chat, { image: buffer, caption: `📂 Archivo: ${path.basename(filePath)}` })
      } else if (mime === "video") {
        await conn.sendMessage(m.chat, { video: buffer, caption: `📂 Archivo: ${path.basename(filePath)}` })
      }
    }

  } catch (e) {
    m.reply("❌ Error al leer el archivo:\n\n" + e.message)
  }
}

handler.command = ['readfile']
handler.help = ["readfile <ruta>"]
handler.tags = ["owner"]
handler.owner = true

export default handler