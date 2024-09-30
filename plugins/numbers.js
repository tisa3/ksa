import fs from 'fs';

let handler = async (m, { conn }) => {
	let array = [];
	let total = 100;

	for (let i = 0; i < total; i++) {
		let result6 = `2126${String(i).padStart(7, '0')}@s.whatsapp.net`;
		let result7 = `2127${String(i).padStart(7, '0')}@s.whatsapp.net`;

		for (let result of [result6, result7]) {
			if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
				let info = await conn.fetchStatus(result).catch(_ => {});
				array.push({ exists: true, jid: result, ...info });
			}
			if (array.length >= 100) break;
		}
		if (array.length >= 100) break;
	}

	let registered = array.filter(v => v.exists).map(v => ({
		number: v.jid.split('@')[0],
		bio: v.status || '',
		date: formatDate(v.setAt)
	}));

	fs.writeFileSync('number_maroc.json', JSON.stringify(registered, null, 2));

	m.reply('جاري استخراج الأرقام... تم حفظ الأرقام المسجلة في number_maroc.json');
}
handler.command = /^nowa$/i;

export default handler;

function formatDate(n, locale = 'fr-FR') {
	let d = new Date(n);
	return d.toLocaleDateString(locale, { timeZone: 'Africa/Casablanca' });
}