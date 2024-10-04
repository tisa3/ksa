/*import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (
    !text ||
    (!text.includes('youtube.com/watch?v=') &&
     !text.includes('youtu.be/') &&
     !text.includes('youtube.com/shorts/'))
  ) {
    return m.reply('*Please enter a valid YouTube link to download the audio*\n\nFor example: `!play https://www.youtube.com/watch?v=example` or `!play https://youtu.be/example` or `!play https://www.youtube.com/shorts/example`');
  }

  const url = text.trim(); 
  let retryCount = 0;
  const maxRetries = 15;

  const fetchVideoData = async () => {
    const apiUrl = `https://deliriusapi-official.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.status || !data.data || !data.data.download) {
        throw new Error('Failed to retrieve audio data.');
      }
      return data;
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... attempt ${retryCount}/${maxRetries}`); // تظهر الرسالة هنا فقط في الـ console
        return fetchVideoData(); // إعادة المحاولة
      } else {
        throw error; // التوقف بعد الوصول إلى الحد الأقصى من المحاولات
      }
    }
  };

  try {
    m.reply("_*⏳ Please wait...*_");
    const videoData = await fetchVideoData(); // جلب بيانات الفيديو مع المحاولات

    const { title, author, download, views, likes, duration } = videoData.data;

    await conn.sendMessage(
      m.chat,
      { 
        audio: { url: download.url },
        mimetype: 'audio/mpeg', 
        filename: download.filename, 
        caption: `*Title:* ${title}\n*Author:* ${author}\n*Views:* ${views}\n*Likes:* ${likes}\n*Duration:* ${duration} seconds\n*Size:* ${download.size}\n\n_*Done*_`
      },
      { quoted: m }
    );
  } catch (e) {
    m.reply('An error occurred while processing your request. ' + e.message);
    console.error(e);
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3)$/i;
handler.register = true;
handler.limit = 9;

export default handler;*/


import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (
    !text ||
    (!text.includes('youtube.com/watch?v=') &&
     !text.includes('youtu.be/') &&
     !text.includes('youtube.com/shorts/'))
  ) {
    return m.reply('*Please enter a valid YouTube link to download the audio*\n\nFor example: `!play https://www.youtube.com/watch?v=example` or `!play https://youtu.be/example` or `!play https://www.youtube.com/shorts/example`');
  }

  const url = text.trim(); 
  let retryCount = 0;
  const maxRetries = 20;

  const fetchVideoData = async () => {
    const apiUrl = `https://apikita.exonity.xyz/api/ytdlp2-faster?url=${encodeURIComponent(url)}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.status || !data.result || !data.result.media) {
        throw new Error('Failed to retrieve audio data.');
      }
      return data;
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying... attempt ${retryCount}/${maxRetries}`);
        return fetchVideoData();
      } else {
        throw error;
      }
    }
  };

  try {
    m.reply("_*⏳ Please wait...*_");
    const videoData = await fetchVideoData(); // Fetch video data with retries

    const { mp3, mp4 } = videoData.result.media;

    await conn.sendMessage(
      m.chat,
      { 
        audio: { url: mp3 }, // Send the MP3 audio link
        mimetype: 'audio/mpeg', 
        filename: 'downloaded_audio.mp3', 
        caption: `_*Download complete.*_`
      },
      { quoted: m }
    );
  } catch (e) {
    m.reply('An error occurred while processing your request. ' + e.message);
    console.error(e);
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = /^(ytmp3)$/i;

export default handler;