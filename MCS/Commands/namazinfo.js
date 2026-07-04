const path = require("path");
const fs = require("fs");

module.exports = {
 config: {
 name: "namazinfo",
 aliases: ["namazinf"],
 version: "2.2.0",
 role: 0,
 credit: "MOHAMMAD BADOL",
 prefix: true,
 cooldown: 5
 },

 onStart: async function(api, event, args) {
 const msg = `╭─━─━─━─━─━─━─╮\n 🕌 নামাজের মেনু\n╰─━─━─━─━─━─━─╯\n\n1. ফজর\n2. যোহর\n3. আসর\n4. মাগরিব\n5. এশা\n6. জুম্মা\n7. তাহাজ্জুদ\n\n💡 নাম্বার লিখে রিপ্লাই দিন।\n\n🚀 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`;

 return api.sendMessage(msg, event.threadID, (err, info) => {
 if (!err && info && info.messageID) {
 global.msgCache.set(info.messageID, {
 commandName: "namazinfo",
 senderID: event.senderID
 });
 }
 }, event.messageID);
 },

 onReply: async function(api, event, cache) {
 const input = parseInt(event.body);
 if (isNaN(input) || input < 1 || input > 7) {
 return api.sendMessage("❌ দয়া করে ১ থেকে ৭ এর মধ্যে একটি নাম্বার লিখুন।", event.threadID, event.messageID);
 }

 const filePath = path.join(__dirname, "B4D9L", `namaz${input}.json`);

 if (!fs.existsSync(filePath)) {
 return api.sendMessage("❌ এই ডাটা ফাইলটি পাওয়া যায়নি।", event.threadID, event.messageID);
 }

 try {
 const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
 
 // সুন্দর ডিজাইন বক্স শুরু
 let msg = `╭─━─━─━─━─━─━─╮\n 🕋 নামাজের নিয়মাবলি\n╰─━─━─━─━─━─━─╯\n\n`;
 
 data.forEach(step => {
 msg += `📌 [ ${step.title} ]\n`;
 msg += `• কাজ: ${step.details}\n`;
 msg += `• পাঠ: ${step.recitation}\n`;
 msg += `• অর্থ: ${step.meaning}\n`;
 msg += `• সময়: ${step.times}\n`;
 msg += `─────────────────────\n`;
 });
 
 msg += `\n✅ সম্পূর্ণ হয়েছে।\n🚀 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`;

 return api.sendMessage(msg, event.threadID, event.messageID);
 } catch (error) {
 return api.sendMessage("❌ ফাইল রিড করতে সমস্যা হচ্ছে।", event.threadID, event.messageID);
 }
 }
};
