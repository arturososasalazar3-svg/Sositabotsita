// lib/welcome.js
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom'
import JsBarcode from 'jsbarcode'
import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

const src = join(new URL('.', import.meta.url).pathname, '..', 'src')
const _svg = readFileSync(join(src, 'welcome.svg'), 'utf-8')

/** Convierte SVG a imagen usando ImageMagick */
const toImg = (svg, format = 'png') =>
  new Promise((resolve, reject) => {
    if (!svg) return resolve(Buffer.alloc(0))
    const bufs = []
    const im = spawn('magick', ['convert', 'svg:-', `${format}:-`])
    im.on('error', e => reject(e))
    im.stdout.on('data', chunk => bufs.push(chunk))
    im.stdin.write(Buffer.from(svg))
    im.stdin.end()
    im.on('close', code => {
      if (code !== 0) reject(new Error(`ImageMagick exited with code ${code}`))
      resolve(Buffer.concat(bufs))
    })
  })

/** Convierte buffer a Base64 */
const toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`

/** Genera código de barras SVG */
const barcode = data => {
  const xmlSerializer = new XMLSerializer()
  const doc = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)
  const svgNode = doc.createElementNS('http://www.w3.org/2000/svg', 'svg')
  JsBarcode(svgNode, data, { xmlDocument: doc })
  return xmlSerializer.serializeToString(svgNode)
}

const imageSetter = (img, value) => { if (img) img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value) }
const textSetter = (el, value) => { if (el) el.textContent = value }

/** Genera SVG dinámico con los datos */
const genSVG = async ({ wid = '', pp = join(src, 'avatar_contact.png'), title = '', name = '', text = '', background = '' } = {}) => {
  const { document: svgDoc } = new JSDOM(_svg).window

  const el = {
    code: ['#_1661899539392 > g:nth-child(6) > image', imageSetter, toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png')],
    pp: ['#_1661899539392 > g:nth-child(3) > image', imageSetter, pp],
    text: ['#_1661899539392 > text.fil1.fnt0', textSetter, text],
    title: ['#_1661899539392 > text.fil2.fnt1', textSetter, title],
    name: ['#_1661899539392 > text.fil2.fnt2', textSetter, name],
    bg: ['#_1661899539392 > g:nth-child(2) > image', imageSetter, background],
  }

  for (let [selector, set, value] of Object.values(el)) {
    const node = svgDoc.querySelector(selector)
    set(node, value)
  }

  return svgDoc.body.innerHTML
}

/** Renderiza imagen final desde SVG */
const render = async ({
  wid = '',
  pp = toBase64(readFileSync(join(src, 'avatar_contact.png')), 'image/png'),
  name = '',
  title = '',
  text = '',
  background = toBase64(readFileSync(join(src, 'Aesthetic', 'Aesthetic_000.jpeg')), 'image/jpeg'),
} = {}, format = 'png') => {
  const svg = await genSVG({ wid, pp, name, title, text, background })
  return await toImg(svg, format)
}

export { render as renderWelcome }