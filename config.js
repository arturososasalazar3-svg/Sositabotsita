import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

global.owner = [
  [ '595986556775', 'sosa', true ],
  [ '595986556775', 'sosa', true ],
  [ '5219531627349', 'mariela', true ],
  [ '595986556775', 'sosa', true ],
  ['155968113483985@lid'],
  ['155968113483985'],
]; 

global.suittag = ['50432955554'] 
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.Jadibts = true
global.packname = '𝙺𝚒𝚛𝚒𝚝𝚘-𝙱𝚘𝚝 𝙼𝙳';
global.botname = '𝐾𝑖𝑟𝑖𝑡𝑜-𝐵𝑜𝑡 𝑀𝐷'
global.author = 'Made By 𝐃𝐞𝐲𝐥𝐢𝐧 -`ღ´-'
global.dev = '© ρσɯҽɾҽԃ Ⴆყ 𝑫ҽყʅιɳ'
global.textbot = 'ᴋɪʀɪᴛᴏ-ʙᴏᴛ ᴍᴅ • ꉣꄲꅐꏂꋪꏂ꒯ ꃳꌦ 𝑫𝒆𝒚𝒍𝒊𝒏'
global.etiqueta = '𝑫𝒆𝒚𝒍𝒊𝒏'
global.ch = {
ch1: '120363403593951965@newsletter',
ch2: '120363403593951965@newsletter',
}
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

let icono1 = [
  'https://i.postimg.cc/c4t9wwCw/1756162596829.jpg',
  'https://i.postimg.cc/c4MvC5Wz/1756167144046.jpg',
  'https://i.postimg.cc/qMdtkHPn/1756167135980.jpg',
]

global.inc = icono1[Math.floor(Math.random() * icono1.length)];

const res = await fetch(inc);
const img = Buffer.from(await res.arrayBuffer());


async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
