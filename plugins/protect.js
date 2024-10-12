import fs from 'fs';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (command === 'protect') {
    if (text.length > 0) {
        const phoneNumber = text.replace(/[+\s-]/g, '');
        const filePath = 'spam/protect.json';

        let data = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            try {
                data = JSON.parse(fileContent);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        }

        if (data.includes(phoneNumber)) {
            conn.reply(m.chat, `The number ${phoneNumber} is already protected`, m);
        } else {
            data.push(phoneNumber);

            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
            conn.reply(m.chat, `Protection has been activated for number ${phoneNumber}`, m);
        }
    }
    } else if (command === 'unprotect') {
    if (text.length > 0) {
        const phoneNumber = text.replace(/[+\s-]/g, '');
        const filePath = 'spam/protect.json';

        let data = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            try {
                data = JSON.parse(fileContent);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        }

        if (data.includes(phoneNumber)) {
            data = data.filter(number => number !== phoneNumber);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
            conn.reply(m.chat, `Protection has been removed for number ${phoneNumber}`, m);
        } else {
            conn.reply(m.chat, `The number ${phoneNumber} is not protected`, m);
        }
    }
    }
};

handler.command = /^(protect|unprotect)$/i;
handler.rowner = true;
export default handler;