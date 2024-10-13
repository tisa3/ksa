import fs from 'fs';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' +212 658-323376';

    let phoneNumber = text.replace(/[^\d]/g, '');
    let userId = m.sender.split('@')[0];

    if (userId !== '212679593105' && (phoneNumber === '212679593105' || phoneNumber === '212658323376')) {
        return conn.reply(m.chat, 'This number is not allowed for you.', m);
    }

    let protectData = [];
    if (fs.existsSync('spam/protect.json')) {
        protectData = JSON.parse(fs.readFileSync('spam/protect.json'));
    }

    if (protectData.includes(phoneNumber)) {
        return conn.reply(m.chat, 'This number is protected by the owner.', m);
    }

    let data = {};
    if (fs.existsSync('spam/numbers_spam.json')) {
        data = JSON.parse(fs.readFileSync('spam/numbers_spam.json'));
    }

    if (!data[userId]) {
        data[userId] = [];
    }

    if (data[userId].length > 0) {
        return conn.reply(m.chat, 'Please delete the existing number before adding a new one.', m);
    }

    data[userId].push(phoneNumber);
    fs.writeFileSync('spam/numbers_spam.json', JSON.stringify(data, null, 2));

    conn.reply(m.chat, `Your user id: ${userId}\nNumber target: ${phoneNumber}`, m);
};

handler.command = /^(spam)$/i;
handler.help = [`spam`];
handler.tags = [`bot_command`];
export default handler;