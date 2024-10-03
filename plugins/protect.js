import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (text.length > 0) {
        const phoneNumber = text.replace(/[+\s-]/g, '');
        const filePath = path.join(__dirname, 'spam', 'protect.json');

        const data = {};
        data[phoneNumber] = phoneNumber; 

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
        conn.reply(m.chat, `تم تفعيل الحماية ل رقم ${phoneNumber}`, m);
    }
};

handler.command = /^(protect)$/i;
export default handler;