import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';
import urlRegex from 'url-regex-safe';
import terminalImage from 'terminal-image';

const opts = {
  img: true,
};

export default async function printMessage(m, conn = { user: {} }) {
  if (!m || !m.sender) return;

  try {
    const senderName = await conn.getName(m.sender);
    const sender = new PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (senderName ? ` ~${senderName}` : '');
    const chatName = await conn.getName(m.chat);

    const now = new Date();
    const formattedTime = now.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = now.toLocaleString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });

    const isGroup = m.isGroup;
    const chatInfo = chatName ? (isGroup ? `Grupo: ${chatName}` : `Chat privado: ${chatName}`) : 'Chat desconocido';

    console.log(chalk.bold.hex('#00FFFF')(`╔═══════════════════════════════════`));
    console.log(chalk.hex('#00FFFF')(`║ ⏱️  ${chalk.hex('#7FFF00').bold(formattedTime)}`));
    console.log(chalk.hex('#00FFFF')(`║ 📅  ${chalk.hex('#7FFF00').bold(formattedDate)}`));
    console.log(chalk.hex('#00FFFF')(`║ 👤  ${chalk.hex('#FF4500').bold(sender)}`));
    console.log(chalk.hex('#00FFFF')(`║ 🌐  ${chalk.hex('#7FFF00')(chatInfo)}`));
    console.log(chalk.bold.hex('#00FFFF')(`╚═══════════════════════════════════`));

    if (/sticker|image/gi.test(m.mtype)) {
      console.log('🖼️ Mensaje con imagen o sticker.');
      return;
    }

    if (typeof m.text === 'string' && m.text.length > 0) {
      let log = m.text.replace(/\u200e+/g, '');
      log = log.replace(urlRegex({ strict: false }), (url) => chalk.blueBright(url));

      if (m.mentionedJid && Array.isArray(m.mentionedJid)) {
        for (const userJid of m.mentionedJid) {
          const userName = await conn.getName(userJid);
          log = log.replace(new RegExp(`@${userJid.split('@')[0]}`, 'g'), chalk.blueBright(`@${userName}`));
        }
      }

      console.log(m.error ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);
    }

    console.log();
  } catch (error) {
    console.error(chalk.red('Ocurrió un error inesperado en la función printMessage:', error));
  }
}

const file = global.__filename(import.meta.url);
watchFile(file, () => {
  console.log(chalk.bold.redBright("Se ha actualizado el archivo 'lib/print.js'"));
});
