import fs from 'fs';

let handler = async (m, { conn, text }) => {
    if (text.length === 0) return conn.reply(m.chat, 'Please enter a number, e.g., prefix + command + "+212 657-3244-76".', m);
    
    let phoneNumber = text.replace(/[^\d]/g, '');
    let userId = m.sender.split('@')[0];

    let data = {};
    if (fs.existsSync('spam/numbers_spam.json')) {
        data = JSON.parse(fs.readFileSync('spam/numbers_spam.json'));
    }

    if (!data[userId]) {
        data[userId] = [];
    }

    if (data[userId].includes(phoneNumber)) {
        return conn.reply(m.chat, 'This number already exists in your account.', m);
    }

    data[userId].push(phoneNumber);
    fs.writeFileSync('spam/numbers_spam.json', JSON.stringify(data, null, 2));

    conn.reply(m.chat, `Your user id: ${userId}\nNumber target: ${phoneNumber}`, m);
};

handler.command = /^(test)$/i;
export default handler;