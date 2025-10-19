import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import fs from 'fs';

const welcomeSent = {};
const filePath = './extras/sent_welcome.json';
    
if (fs.existsSync(filePath)) {
  Object.assign(welcomeSent, JSON.parse(fs.readFileSync(filePath, 'utf-8')));
}

function saveState() {
  fs.writeFileSync(filePath, JSON.stringify(welcomeSent, null, 2), 'utf-8');
}

export async function before(m, { conn }) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;

  const user = m.sender;
  const userId = m.mentionedJid?.[0] || m.sender

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (welcomeSent[user] && (now - welcomeSent[user]) < oneDay) {
    return true;
  }

  const content = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: `👋 Hola ${m.pushName}!\n\n¿Presiona el botón? 🚀\n> ¡No tengas miedo!` },
          footer: { text: "Comparte nuestro grupo y únete" },
          header: { title: "😅", hasMediaAttachment: false },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Comparte 👑",
                  url: "https://wa.me/?text=*🔥+HOLA+ÚNETE+AL+GRUPO+DE+ESTE+BOT:*+https://chat.whatsapp.com/KqCNNwfKZAbEK7WnhdfVPP",
                  merchant_url: "https://wa.me"
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Únete 🌟",
                  url: "https://goo.su/N5qKM2Y",
                  merchant_url: "https://wa.me"
                })
              }
            ]
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(m.chat, content, { quoted: m, mentionedJid: [userId] });
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  welcomeSent[user] = now;
  saveState();

  return true;
}