import fetch from 'node-fetch';
import uploader from '../lib/uploadImage.js';

var handler = async (m, { conn, text, command, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        let buffer = await q.download();

        await m.reply("Please wait...");

        let media = await uploader(buffer);
       
        let response = await fetch(`https://mee-api.vercel.app/api/bard?text=${encodeURIComponent(text)}&url_image=${media}`);
        let json = await response.json();

        if (json.status) {
            conn.sendMessage(m.chat, { text: json.response }, { quoted: m });
        } else {
            throw `Failed to process the image. Try again.`;
        }
    } else {
        throw `Please reply to an image with a text.\n\nExample:\n${usedPrefix + command} solve`;
    }
};

handler.help = ['bardimg', 'geminiimg'];
handler.tags = ['tools'];
handler.command = /^(bardimg|bardimage|geminiimg|geminiimage|geminimg|geminimage)$/i;


export default handler;