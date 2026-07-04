const os = require("os");
const axios = require("axios");

module.exports.config = {
 name: "up",
 aliases: ["uptime", "status"],
 version: "1.0.0",
 credit: "MOHAMMAD BADOL",
 role: 0,
 prefix: true,
 cooldown: 5,
 description: "Show bot uptime",
 category: "system"
};

module.exports.onStart = async function (api, event, args) {
 try {
 const { threadID, messageID } = event;

 const up = process.uptime();

 const day = Math.floor(up / 86400);
 const hour = Math.floor((up % 86400) / 3600);
 const min = Math.floor((up % 3600) / 60);
 const sec = Math.floor(up % 60);

 const ping = Date.now() - event.timestamp;

 const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
 const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
 const usedRam = (totalRam - freeRam).toFixed(2);

 const imgURL = "https://drive.google.com/uc?export=download&id=10uyk8qP2HyERBxGgVek2uEcLd_ok0Zud";

 const getStream = async (url) => {
 const res = await axios.get(url, {
 responseType: "stream"
 });
 return res.data;
 };

 const msg =
`╭━━〔 🤖 𝐁𝐎𝐓 𝐒𝐓𝐀𝐓𝐔𝐒 〕━━╮
 🟢 𝐒𝐓𝐀𝐓𝐔𝐒 : Online
⚡ 𝐏𝐈𝐍𝐆 : ${ping} ms
 
 ⏰ 𝐔𝐏𝐓𝐈𝐌𝐄 :
 {day} Day ${hour} Hour ${min} Min ${sec} Sec
 
 💾 𝐑𝐀𝐌 : ${usedRam}GB / ${totalRam}GB
 🖥️ 𝐎𝐒 : ${os.platform()}
 📦 𝐍𝐎𝐃𝐄 : ${process.version}

 👑 𝐎𝐖𝐍𝐄𝐑 : 𝐒𝐀𝐄𝐄𝐌 𝐒𝐇𝐄𝐈𝐊𝐇
 ╰━━━━━━━━━━━━━━━━━━━╯`;

 return api.sendMessage(
 {
 body: msg,
 attachment: await getStream(imgURL)
 },
 threadID,
 messageID
 );

 } catch (err) {
 return api.sendMessage(
 "❌ Error: " + err.message,
 event.threadID,
 event.messageID
 );
 }
};
