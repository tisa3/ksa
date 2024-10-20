import fetch from "node-fetch";

let handler = async (m, { text }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';

  if (!mime) throw 'Please reply with an image!';

  let media = await q.download();
  
  let imageArray = imageToArray(media);

  if (typeof text !== 'string') {
    throw 'Text must be a string!';
  }

  let res = await bardimg(imageArray, text);
  await m.reply(res);
}

handler.command = /^(t)$/i;
export default handler;

function imageToArray(imageBuffer) {
  return Array.from(imageBuffer);
}

const bardimg = async (imageai, text) => {
  const data = {
    image: imageai,
    query: text
  };

  try {
    const response = await fetch(`https://ai.xterm.codes/api/img2txt/gemini-image?key=`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://ai.xterm.codes/documentation'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error('Error:', error);
  }
};