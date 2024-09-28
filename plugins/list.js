import pkg from '@whiskeysockets/baileys';
import fs from 'fs/promises';

const { generateWAMessageFromContent, proto } = pkg;

const apkData = [{ title: "Your Victims" }];

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (command === 'list') {
        let userId = m.sender.split('@')[0];
        let spamNumbers = {};
        try {
            const data = await fs.readFile('spam/numbers_spam.json', 'utf-8');
            spamNumbers = JSON.parse(data);
        } catch (err) {
            throw 'Error reading spam numbers file.';
        }

        if (spamNumbers[userId] && spamNumbers[userId].length > 0) {
            const numbers = spamNumbers[userId];
            const list = apkData.map((app) => ({
                title: "Your Victims",
                rows: numbers.map(number => ({
                    title: number,
                    id: `${usedPrefix}delete ${number}`
                }))
            }));

            const sections = list.map((item) => ({
                title: item.title,
                rows: item.rows
            }));

            const buttonParamsJson = JSON.stringify({
                title: "View Your Victims",
                sections: sections
            });

            const interactiveMessage = {
                body: { text: "🦂Zoldyk_Spam" },
                footer: { text: "_by Mee6Team_" },
                nativeFlowMessage: {
                    buttons: [{
                        name: "single_select",
                        buttonParamsJson
                    }]
                }
            };

            const message = {
                messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                interactiveMessage
            };

            await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
        } else {
            throw 'You have not added any victims.';
        }
    } else if (command === 'delete') {
        let userId = m.sender.split('@')[0];
        let spamNumbers = {};
        try {
            const data = await fs.readFile('spam/numbers_spam.json', 'utf-8');
            spamNumbers = JSON.parse(data);
        } catch (err) {
            throw 'Error reading spam numbers file.';
        }

        if (spamNumbers[userId] && spamNumbers[userId].length > 0) {
            const numberToDelete = text;
            if (spamNumbers[userId].includes(numberToDelete)) {
                spamNumbers[userId] = spamNumbers[userId].filter(num => num !== numberToDelete);
                await fs.writeFile('spam/numbers_spam.json', JSON.stringify(spamNumbers, null, 2));
                await m.reply(`Number ${numberToDelete} has been deleted.`);
            } else {
                throw 'Number not found in your victims list.';
            }
        } else {
            throw 'You have not added any victims.';
        }
    }
};

handler.command = /^(list|delete)$/i;
export default handler;