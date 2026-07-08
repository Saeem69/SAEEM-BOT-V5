const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "adminmention",
  version: "3.0.0",
  role: 0,
  credit: "MOHAMMAD BADOL",
  description: "Admin মেনশন দিলে অটো ফানি রিপ্লাই",
  category: "system",
  prefix: false,
  cooldown: 5
};

// 👑 এখানে Admin UID বসান
const adminIDs = [
  "100022291393952"
];

// 🖼️ এখানে আপনার ছবির Direct Link বসান
const IMAGE_URL = "https://drive.google.com/uc?export=download&id=1G3Wn_gDX-tljSSuOrtn5nyTtcneDMf0k";

module.exports.onChat = async function (api, event) {
  try {
    const { threadID, messageID, senderID, mentions } = event;

    if (senderID == api.getCurrentUserID()) return;
    if (!mentions || Object.keys(mentions).length === 0) return;

    const mentionedAdmin = Object.keys(mentions).find(id => adminIDs.includes(id));
    if (!mentionedAdmin) return;

    if (global.adminMentioned === messageID) return;
    global.adminMentioned = messageID;

    const funnyReplies = [
`╭━〔 👑 OWNER NOTICE 〕━╮
┃ 📵 বস এখন অফলাইনে আছেন।
┃ 📩 আপনার মেনশন পৌঁছে গেছে।
┃ ⏳ একটু ধৈর্য ধরুন।
╰━━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 🤖 SAEEM-BOT-V5 〕━╮
┃ 👑 বসকে বেশি মেনশন করবেন না।
┃ 😌 উনি নিজেই সব দেখছেন।
┃ ❤️ ধন্যবাদ।
╰━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 ⚡ SYSTEM 〕━╮
┃ 📡 Owner বর্তমানে ব্যস্ত।
┃ 📨 আপনার নোটিফিকেশন পাঠানো হয়েছে।
┃ ⏳ রিপ্লাইয়ের অপেক্ষা করুন।
╰━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 😂 FUN MODE 〕━╮
┃ 😅 বসকে ডাকলেই আসবে ভাবছেন?
┃ 🤭 একটু অপেক্ষা করুন।
┃ 👑 উনিও মানুষ!
╰━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 ❤️ RESPECT 〕━╮
┃ 🌸 Owner কে সম্মান করুন।
┃ 🚫 অযথা মেনশন করবেন না।
┃ 😊 ধন্যবাদ।
╰━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 ⏳ WAIT 〕━╮
┃ 📬 আপনার মেনশন জমা হয়েছে।
┃ 👑 বস দেখলেই উত্তর দিবেন।
┃ 💖 ধৈর্য ধরুন।
╰━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 🔥 OWNER 〕━╮
┃ 👑 বস এখন কোডিং করছেন।
┃ 💻 বিরক্ত করলে বাগ হতে পারে।
┃ 😂 পরে আবার আসুন।
╰━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 ☕ BREAK TIME 〕━╮
┃ ☕ বস চা খেতে গেছেন।
┃ 📢 ফিরে এলেই জানানো হবে।
┃ 😁 অপেক্ষা করুন।
╰━━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 🎮 GAMING 〕━╮
┃ 🎮 বস এখন গেম খেলছেন।
┃ 🏆 ম্যাচ শেষ হলে আসবেন।
┃ 😎 একটু অপেক্ষা করুন।
╰━━━━━━━━━━━━━━━━━━╯`,

`╭━〔 🌙 NIGHT MODE 〕━╮
┃ 😴 বস বিশ্রামে আছেন।
┃ 🌟 জরুরি হলে ইনবক্স করুন।
┃ ❤️ শুভকামনা।
╰━━━━━━━━━━━━━━━━━━━╯`
    ];

    const randomMsg = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const filePath = path.join(cacheDir, `adminmention_${Date.now()}.jpg`);

    const response = await axios({
      url: IMAGE_URL,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: randomMsg,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.remove(filePath),
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage(randomMsg, threadID, messageID);
    });

  } catch (err) {
    console.log(err);
    api.sendMessage("❌ Admin Mention System Error!", event.threadID, event.messageID);
  }
};

module.exports.onStart = async function () {};
