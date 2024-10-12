/*import fetch from 'node-fetch';

async function fetchWithRetry(url, options = {}, retries = 12, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response; // Return successful response
    } catch (error) {
      if (attempt < retries) {
        console.log(`Retrying... attempt ${attempt}/${retries}`);
        await new Promise(res => setTimeout(res, delay)); // Wait before retrying
      } else {
        throw new Error(`Failed after ${retries} attempts: ${error.message}`);
      }
    }
  }
}

const handler = async (m, { conn, text }) => {
  // Check if the text includes valid YouTube URLs including shorts
  if (
    !text ||
    (!text.includes('youtube.com/watch?v=') &&
      !text.includes('youtu.be/') &&
      !text.includes('youtube.com/shorts/'))
  ) {
    return m.reply('*Please enter a valid YouTube link to download the video*\n\nFor example: `!ytmp4 https://www.youtube.com/watch?v=example` or `!ytmp4 https://youtu.be/example` or `!ytmp4 https://www.youtube.com/shorts/example`');
  }

  const url = text.trim(); // Use the provided URL

  try {
    m.reply("_*⏳ Please wait...*_");

    const apiUrl = `https://deliriusapi-official.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`;

    // Use fetchWithRetry to retry fetching data 9 times
    const response = await fetchWithRetry(apiUrl);

    const data = await response.json();
    
    // Check if the API returned a successful response
    if (!data.status || !data.data || !data.data.download) {
      throw new Error('Failed to retrieve video data.');
    }

    const { title, author, download, views, likes } = data.data;

    // Send the video file with additional details
    await conn.sendMessage(
      m.chat,
      { 
        video: { url: download.url }, // Use the video URL from the JSON
        mimetype: 'video/mp4', 
        filename: download.filename, 
        caption: `*Title :* ${title}\n*Author :* ${author}\n*Views :* ${views}\n*Likes :* ${likes}\n*Quality :* ${download.quality}\n*Size :* ${download.size}\n`
      },
      { quoted: m }
    );

  } catch (e) {
    m.reply('An error occurred while processing your request. ' + e.message);
    console.error(e);
  }
};

handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4)$/i;
handler.register = true;
handler.limit = 12;

export default handler;*/



import fetch from 'node-fetch';

// Helper function to retry fetch requests
async function fetchWithRetry(url, options = {}, retries = 20, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response; // Return successful response
    } catch (error) {
      if (attempt < retries) {
        console.log(`Retrying... attempt ${attempt}/${retries}`);
        await new Promise(res => setTimeout(res, delay)); // Wait before retrying
      } else {
        throw new Error(`Failed after ${retries} attempts: ${error.message}`);
      }
    }
  }
}

const handler = async (m, { conn, text }) => {
  // Check if the text includes valid YouTube URLs including shorts
  if (
    !text ||
    (!text.includes('youtube.com/watch?v=') &&
      !text.includes('youtu.be/') &&
      !text.includes('youtube.com/shorts/'))
  ) {
    return m.reply('*Please enter a valid YouTube link to download the video*\n\nFor example: `!ytmp4 https://www.youtube.com/watch?v=example` or `!ytmp4 https://youtu.be/example` or `!ytmp4 https://www.youtube.com/shorts/example`');
  }

  const url = text.trim(); // Use the provided URL

  try {
    m.reply("_*⏳ Please wait...*_");

    const apiUrl = `https://apikita.exonity.xyz/api/ytdlp2-faster?url=${encodeURIComponent(url)}`;

    // Use fetchWithRetry to retry fetching data 12 times
    const response = await fetchWithRetry(apiUrl);

    const data = await response.json();
    
    // Check if the API returned a successful response
    if (!data.status || !data.result || !data.result.media || !data.result.media.mp4) {
      throw new Error('Failed to retrieve video data.');
    }

    const { mp4 } = data.result.media;

    // Send the video file with additional details
    await conn.sendMessage(
      m.chat,
      { 
        video: { url: mp4 }, // Use the MP4 URL from the JSON
        mimetype: 'video/mp4', 
        caption: `*Downloaded via API*`
      },
      { quoted: m }
    );

  } catch (e) {
    m.reply('An error occurred while processing your request. ' + e.message);
    console.error(e);
  }
};

handler.help = ['ytmp4'];
handler.tags = ['downloader'];
handler.command = /^(ytmp4)$/i;

export default handler;