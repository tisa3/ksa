import fs from 'fs';

const handler = async (m, {conn, usedPrefix}) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  try {
    let picture = './media/menus/img4.jpg';
    const img = fs.readFileSync(picture);
    m.react('📥');
    const taguser = '@' + m.sender.split('@')[0];

    const str = `▢ *hello, ${taguser}*
    
    _*< Owner Bot DaLich >*_

instagram.com/dalich._.98    

    _*< Download Commands />*_

    ▢ _/spam_
    ▢ _/list_
    ▢ _/gift_`.trim();
    
    const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}, 'participant': '0@s.whatsapp.net'};
    
    const mentions = [...str.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');
    const messageOptions = { image: img, caption: str.trim(), mentions };

    conn.sendMessage(m.chat, messageOptions, { quoted: fkontak2 });
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '*[ ℹ️ ] Este menú tiene un error interno, por lo cual no fue posible enviarlo.*', m);
  }
};

handler.command = /^(menu|help)$/i;

export default handler;