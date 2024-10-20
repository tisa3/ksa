import fs from 'fs';
import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!mime) throw 'Please reply image!';
  if (!text) return m.reply("Harap berikan pertanyaan!");  

  let media = await q.download();
  const tempImagePath = 'temp_image.jpg';
  fs.writeFileSync(tempImagePath, media);

  const imageArray = imageToArray(tempImagePath);

  const data = {
    image: imageArray,
    query: text
  };

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
  m.reply(apiResponse.result || 'No result found.');
  fs.unlinkSync(tempImagePath);
};

handler.command = /^(t)$/i;
export default handler;

const imageToArray = (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);
  return Array.from(imageBuffer);
};