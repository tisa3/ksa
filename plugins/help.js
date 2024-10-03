import fs from 'fs';

let handler = async (m, { conn, args }) => {
    const imagePath = 'spam/kite.jpg';
    const audioPath = 'media/a.mp3';
    
    if (fs.existsSync(imagePath) && fs.existsSync(audioPath)) {
        const today = new Date().toLocaleDateString(); 
        const options = { timeZone: 'Africa/Casablanca', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeInMorocco = new Date().toLocaleTimeString('en-US', options);
        const uptime = process.uptime();

        const uptimeMessage = `Uptime: ${Math.floor(uptime / 3600)} hours, ${Math.floor((uptime % 3600) / 60)} minutes, ${Math.floor(uptime % 60)} seconds`;

        const message = `> Date: ${today}\n> Time: ${timeInMorocco}\n> ${uptimeMessage}`;
        
        await conn.sendFile(m.chat, imagePath, 'kite.jpg', message, m);
        await conn.sendFile(m.chat, audioPath, 'a.mp3', '', m);
    } else {
        conn.reply(m.chat, 'Image or audio not found!', m);
    }
};

handler.command = /^(help)$/i;
export default handler;