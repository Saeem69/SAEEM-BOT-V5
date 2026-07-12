const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { Jimp } = require("jimp");

module.exports.config = {
  name: "fuck3",
  version: "1.0.8",
  role: 1,
  credit: "MOHAMMAD BADOL",
  description: "fuck you",
  prefix: true,
  category: "fun",
  aliases: ["fucku"],
  usages: "@mention & reply",
  cooldown: 5
};

async function circle(image) {
  const img = await Jimp.read(image);
  img.circle();
  return await img.getBuffer("image/png");
}

async function makeImage({ one, two }) {
  const bgUrl = "https://drive.google.com/uc?id=1B9PuRuH89gWd5j60SnyhH6Qbl1zeW8Zf";
  const pathImg = path.join(__dirname, `fuck_${one}_${two}_${Date.now()}.png`);
  const avatarOnePath = path.join(__dirname, `avt_${one}.png`);
  const avatarTwoPath = path.join(__dirname, `avt_${two}.png`);

  const getAvatar = async (uid, savePath) => {
    try {
      const res = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer", timeout: 10000 });
      await fs.writeFile(savePath, res.data);
    } catch {
      const res = await axios.get(`https://graph.facebook.com/${uid}/picture?type=large`, { responseType: "arraybuffer" });
      await fs.writeFile(savePath, res.data);
    }
  };

  await Promise.all([getAvatar(one, avatarOnePath), getAvatar(two, avatarTwoPath)]);

  // সরাসরি লিঙ্ক থেকে ব্যাকগ্রাউন্ড ইমেজ লোড
  const bgRes = await axios.get(bgUrl, { responseType: 'arraybuffer' });
  const bg = await Jimp.read(bgRes.data);
  const circOne = await Jimp.read(await circle(avatarOnePath));
  const circTwo = await Jimp.read(await circle(avatarTwoPath));

  /* 
     পজিশন এবং সাইজ কন্ট্রোল গাইডলাইন:
     [নিজের প্রোফাইল পজিশন]
     - সাইজ: w, h বাড়ালে বড় হবে, কমালে ছোট হবে।
     - ডানে-বামে: X বাড়ালে ডানে যাবে, কমালে বামে যাবে।
     - উপরে-নিচে: Y কমালে উপরে যাবে, বাড়ালে নিচে আসবে।

     [ইউজার প্রোফাইল পজিশন]
     - সাইজ: w, h বাড়ালে বড় হবে, কমালে ছোট হবে।
     - ডানে-বামে: X বাড়ালে ডানে যাবে, কমালে বামে যাবে।
     - উপরে-নিচে: Y কমালে উপরে যাবে, বাড়ালে নিচে আসবে।
  */

  bg.composite(circOne.resize({ w: 180, h: 180 }), 350, 200);
  bg.composite(circTwo.resize({ w: 180, h: 180 }), 600, 200);

  const finalImg = await bg.getBuffer("image/png");
  await fs.writeFile(pathImg, finalImg);
  fs.unlink(avatarOnePath).catch(() => {});
  fs.unlink(avatarTwoPath).catch(() => {});
  return pathImg;
}

module.exports.onStart = async function (api, event, args) {
  const { threadID, messageID, senderID, messageReply } = event;
  const targetID = Object.keys(event.mentions)[0] || (messageReply ? messageReply.senderID : null);
  
  if (targetID === "61592056702442") {
    return api.sendMessage("❌ এই আইডির ওপর 'fuck' কমান্ড চালানো নিষেধ!", threadID, messageID);
  }

  if (!targetID) {
    return api.sendMessage("⚠️ একজনকে মেনশন দাও অথবা কারো মেসেজে রিপ্লাই দাও!", threadID, messageID);
  }

  if (senderID === targetID) {
    return api.sendMessage("😏 নিজের সাথে না, অন্যকে মেনশন দাও বেটা!", threadID, messageID);
  }

  const messages = [
    "🥵 Fuck mode activated! আগুন লেগে গেছে!",
    "🔥 ডিরেক্ট হিট! এখন মজা দেখো!",
    "😏 সাবধান! এটা তো স্রেফ শুরু!",
    "💦 ফাক মোড অন! সামলে থেকো!",
    "😈 একে তো ছাড়া যাবে না, প্যাক করে দিলাম!"
  ];
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];

  try {
    const imgPath = await makeImage({ one: senderID, two: targetID });
    return api.sendMessage(
      {
        body: `╭╼|━━━━━━━━━━━━━━|╾╮\n│ ${randomMsg}\n╰╼|━━━━━━━━━━━━━━|╾╯\n✨ SAEEM-BOT-V5`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlink(imgPath).catch(() => {}),
      messageID
    );
  } catch (err) {
    return api.sendMessage(`❌ এরর: ${err.message}`, threadID, messageID);
  }
};
