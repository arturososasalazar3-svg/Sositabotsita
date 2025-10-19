/*export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) {
    return;
  }

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true;
      }
    }
    return false;
  };

  if (!command) return;

  if (command === "bot") {
    return;
    }
  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];

    if (!user.commands) {
      user.commands = 0;
    }
    user.commands += 1;
  } else {
    const comando = m.text.trim().split(' ')[0];
    await conn.reply(m.chat, `⚠️ ¡𝘌𝘴𝘱𝘦𝘳𝘢, 𝘦𝘴𝘦 𝘫𝘶𝘵𝘴𝘶 《 *${comando}* 》 𝘯𝘰 𝘦𝘹𝘪𝘴𝘵𝘦!\n\n🍜 Usa el comando:\n» *#menu* 𝘱𝘢𝘳𝘢 𝘷𝘦𝘳 𝘭𝘰𝘴 𝘥𝘪𝘴𝘱𝘰𝘯𝘪𝘣𝘭𝘦𝘴.`, m, fake);
  }
}*/