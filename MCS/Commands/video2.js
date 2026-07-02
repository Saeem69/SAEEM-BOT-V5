const fs = require("fs");
const path = require("path");
const axios = require("axios");

const usedVideos = new Map();

module.exports = {
 config: {
 name: "video2",
 aliases: ["v2"],
 role: 0,
 credit: "MOHAMMAD BADOL",
 cooldown: 5,
 prefix: true
 },

 onStart: async (api, event, args) => {
 const { threadID, messageID } = event;
 const videoPath = path.join(__dirname, "B4D9L", "videoList.json");

 if (!fs.existsSync(videoPath)) return api.sendMessage("❌ Error: videoList.json not found in B4D9L folder.", threadID, messageID);

 const videosJson = JSON.parse(fs.readFileSync(videoPath, "utf8"));
 const keys = Object.keys(videosJson);

 let msg = `╭───『 VIDEO MENU 』───╮\n\n`;
 keys.forEach((key, index) => {
 msg += `│ [ ${index + 1} ] ${key.toUpperCase()}\n`;
 });
 msg += `\n╰──────────────╯\nReply with a number to watch!`;

 api.sendMessage(msg, threadID, (err, info) => {
 if (!err) global.msgCache.set(info.messageID, { commandName: "video2" });
 }, messageID);
 },

 onReply: async (api, event, cache) => {
 const { threadID, messageID, body, senderID } = event;
 const videoPath = path.join(__dirname, "B4D9L", "videoList.json");
 const videosJson = JSON.parse(fs.readFileSync(videoPath, "utf8"));
 const keys = Object.keys(videosJson);
 const index = parseInt(body) - 1;

 if (isNaN(index) || index < 0 || index >= keys.length) return;

 const selectedKey = keys[index];
 const videoList = videosJson[selectedKey];

 if (!usedVideos.has(senderID)) usedVideos.set(senderID, []);
 let available = videoList.filter(v => !usedVideos.get(senderID).includes(v));

 if (available.length === 0) {
 usedVideos.set(senderID, []);
 available = videoList;
 api.sendMessage("🔄 Playlist reset! Starting fresh for this category.", threadID);
 }

 const randomVideo = available[Math.floor(Math.random() * available.length)];
 usedVideos.get(senderID).push(randomVideo);

 const waitMsg = await api.sendMessage("⏳ Downloading video...", threadID);

 try {
 // গুগল ড্রাইভ লিঙ্ক থেকে ভিডিও ডাউনলোড করার জন্য সঠিক ইউআরএল হ্যান্ডলিং
 const response = await axios.get(randomVideo, { responseType: 'arraybuffer' });
 const tempPath = path.join(__dirname, "B4D9L", `vid_${Date.now()}.mp4`);
 
 fs.writeFileSync(tempPath, Buffer.from(response.data));

 await api.sendMessage({
 body: `🎬 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${selectedKey.toUpperCase()}\n✅ 𝐇𝐄𝐑𝐄 𝐈𝐒 𝐘𝐎𝐔𝐑 𝐕𝐈𝐃𝐄𝐎!\n\n𝐁𝐎𝐓: 𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞`,
 attachment: fs.createReadStream(tempPath)
 }, threadID, () => {
 fs.unlinkSync(tempPath);
 api.unsendMessage(waitMsg.messageID);
 });
 } catch (err) {
 api.sendMessage("❌ Failed to send video. Check the link source.", threadID);
 api.unsendMessage(waitMsg.messageID);
 }
 }
};
