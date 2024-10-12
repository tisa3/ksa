const freeXP = 5000;
const premXP = 20000;
const freelimit = 50; 
const premlimit = 100;

let handler = async (m, { isPrems }) => {
  let time = global.db.data.users[m.sender].lastclaim + 86400000;

  if (new Date() - global.db.data.users[m.sender].lastclaim < 86400000)
    throw `*You have already claimed your daily reward*\n\nCome back in *${msToTime(
      time - new Date()
    )}*`;

  global.db.data.users[m.sender].exp += isPrems ? premXP : freeXP;
  global.db.data.users[m.sender].limit += isPrems ? premlimit : freelimit;

  m.reply(`_*</ Daily Gift 🎉 />*_

_+${isPrems ? premXP : freeXP} Exp 💠_
_+${isPrems ? premlimit : freelimit} Diamonds 💎_`);

  global.db.data.users[m.sender].lastclaim = new Date() * 1;
};
handler.command = ['gift'];
export default handler;

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ' Hours ' + minutes + ' Minutes';
}