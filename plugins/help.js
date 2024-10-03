import fs from 'fs';

let handler = async (m, { conn, args,usedPrefix }) => {
    const imagePath = 'spam/kite.jpg';
    const audioPath = 'spam/hxh.mp3';
    
    if (fs.existsSync(imagePath) && fs.existsSync(audioPath)) {
        const more = String.fromCharCode(8206);
        const readMore = more.repeat(4001);
        const today = new Date().toLocaleDateString(); 
        const options = { timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeInMorocco = new Date().toLocaleTimeString('en-US', options);
        const uptime = process.uptime();

        const uptimeMessage = `Uptime: ${Math.floor(uptime / 3600)} hours, ${Math.floor((uptime % 3600) / 60)} minutes, ${Math.floor(uptime % 60)} seconds`;

        const message = `> Date: ${today}\n> Time: ${timeInMorocco}\n> ${uptimeMessage}\n${readMore}\n\n• ${usedPrefix}spam\n• ${usedPrefix}list`;
        
        await conn.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: message }, { quoted: m });
        await conn.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mp4' }, { quoted: m });
    } else {
        conn.reply(m.chat, 'Image or audio not found!', m);
    }
};

handler.command = /^(help|menu|\?)$/i;
export default handler;