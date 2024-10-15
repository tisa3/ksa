import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) throw 'Ex: ' + usedPrefix + command + ' Twice';

    const query = encodeURIComponent(text);
    const apiURL = `https://deliriussapi-oficial.vercel.app/search/ytsearch?q=${query}`;

    // Fetch data from the new API
    const res = await fetch(apiURL);
    const data = await res.json();

    if (!data.status || !data.data || data.data.length === 0) {
        throw 'No videos found!';
    }

    const list = [];
    for (let i = 0; i < Math.min(10, data.data.length); i++) {
        const video = data.data[i];
        if (!video) continue;

        const duration = video.duration || 'Unknown';
        const isLongVideo = video.duration && parseInt(video.duration.split(':').reduce((acc, time) => (60 * acc) + +time)) > 1800;

        const description = `Duration: ${duration}\nChannel: ${video.author.name || 'Unknown'}\nViews: ${video.views}`;

        const videoOptions = [
            { 
                title: `Download Video ${isLongVideo ? '(❌)' : ''}`,
                description: description,
                id: `${usedPrefix}ytmp4 ${video.url}`
            },
            { 
                title: `Download Music ${isLongVideo ? '(❌)' : ''}`,
                description: description,
                id: `${usedPrefix}ytmp3 ${video.url}`
            }
        ];

        list.push({
            title: `Video ${i + 1}: ${video.title || 'Unknown Title'}`,
            options: videoOptions
        });
    }

    const sections = list.map((item) => {
        return {
            title: item.title,
            rows: item.options
        };
    });

    const firstVideo = data.data[0] || {};
    const icon = firstVideo.thumbnail || 'default_thumbnail_url';

    const buttonParamsJson = JSON.stringify({
        title: "Show Options",
        sections: sections
    });

    const interactiveMessage = {
        body: { text: "Title: " + (firstVideo.title || 'No Title') },
        footer: { text: "by @ang_0y" },
        header: {
            hasMediaAttachment: true, ...(await prepareWAMessageMedia({ image: { url: icon } }, { upload: conn.waUploadToServer }))
        },
        nativeFlowMessage: {
            buttons: [{
                name: "single_select",
                buttonParamsJson
            }]
        }
    };

    const message = {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage
    };

    await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
};

handler.command = /^(play|video|yts|ytsearch|youtube)$/i;
export default handler;