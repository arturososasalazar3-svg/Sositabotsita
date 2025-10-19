import fs from "fs"
import path from "path"

const errorsFile = path.join("./database/errors.json")

let errors = []
if (fs.existsSync(errorsFile)) {
  errors = JSON.parse(fs.readFileSync(errorsFile, "utf-8"))
}

function saveErrors() {
  fs.writeFileSync(errorsFile, JSON.stringify(errors, null, 2))
}

function parseStackTrace(stack) {
  if (!stack) return null
  const lines = stack.split("\n")
  for (const line of lines) {
    const match = line.match(/\((.*):(\d+):(\d+)\)/) || line.match(/at (.*):(\d+):(\d+)/)
    if (match) return { file: match[1], line: match[2], column: match[3] }
  }
  return null
}

export function setupErrorHandler(botName = "Bot") {
  function logError(err, type = "uncaughtException") {
    const trace = parseStackTrace(err.stack)
    const errorData = {
      id: `error${errors.length + 1}`,
      type,
      file: trace?.file || "desconocido",
      line: trace?.line || "desconocida",
      column: trace?.column || "desconocida",
      message: err.message,
      date: new Date().toISOString()
    }
    errors.push(errorData)
    saveErrors()
    console.error(`\n🚨 [${botName}] ${type}:`)
    console.error("📄 Archivo:", errorData.file)
    console.error("🔢 Línea:", errorData.line)
    console.error("📍 Columna:", errorData.column)
    console.error("💥 Mensaje:", errorData.message)
    console.error("───────────────\n")
  }

  process.on("uncaughtException", (err) => logError(err, "uncaughtException"))
  process.on("unhandledRejection", (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason))
    logError(err, "unhandledRejection")
  })
}

let handler = async (m, { args, command }) => {
  if (command === "error") {
    if (errors.length === 0) return m.reply("✅ No se han registrado errores.")
    if (args[0]) {
      const id = `error${args[0]}`
      const err = errors.find(e => e.id === id)
      if (!err) return m.reply("❌ Ese error no existe.")
      return m.reply(
        `📌 *${err.id.toUpperCase()}*\n\n` +
        `📄 Archivo: ${err.file}\n` +
        `🔢 Línea: ${err.line}\n` +
        `📍 Columna: ${err.column}\n` +
        `💥 Mensaje: ${err.message}\n` +
        `🕒 Fecha: ${err.date}`
      )
    }
    let txt = "📋 *Errores registrados:*\n\n"
    for (const e of errors.slice(-5)) {
      txt += `- ${e.id}: ${e.message}\n`
    }
    txt += `\nUsa *.error <número>* para ver detalles.`
    return m.reply(txt)
  }

  if (command === "clearerrors") {
    try {
      if (fs.existsSync(errorsFile)) fs.unlinkSync(errorsFile)
      errors = []
      saveErrors()
      return m.reply("🗑️ Todos los errores fueron eliminados y el historial se reinició.")
    } catch (e) {
      return m.reply("❌ No se pudieron eliminar los errores: " + e.message)
    }
  }
}

handler.command = /^(error|clearerrors)$/i
export default handler