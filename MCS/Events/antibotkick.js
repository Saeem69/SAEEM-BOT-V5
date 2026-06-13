const fs = require("fs-extra");
const path = require("path");

// ════════════════ নোটিফিকেশন গ্রুপ আইডি ════════════════
const NOTICE_GROUP_ID = "27612074005084063"; 

module.exports.config = {
    name: "antibotkick",
    version: "5.1.0",
    credit: "MOHAMMAD BADOL",
    description: "বট কেউ কিক/অ্যাড করলে নির্দিষ্ট গ্রুপে নোটিশ দিবে"
};

module.exports.onEvent = async function (api, event) {
    if (!event.logMessageType) return;
    if (event.logMessageType !== "log:subscribe" && event.logMessageType !== "log:unsubscribe") return;

    const { threadID, logMessageType, logMessageData, author } = event;
    const botID = api.getCurrentUserID();

    let config;
    try {
        config = require("../../config.json");
    } catch (e) {
        console.log("[ANTI-KICK] config.json লোড এরর");
        return;
    }

    const ownerName = config.OWNER_LOCK?.NAME || "Owner";

    // ═══════════════════ বট অ্যাড করলে ═══════════════════
    if (logMessageType === "log:subscribe") {
        const botAdded = logMessageData.addedParticipants?.some(user => user.userFbId == botID);

        if (botAdded) {
            setTimeout(async () => {
                try {
                    const threadInfo = await api.getThreadInfo(threadID);
                    const userInfo = await api.getUserInfo(author);
                    const adderName = userInfo[author]?.name || "Unknown User";

                    const msg = `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ✅ 𝐁𝐎𝐓 𝐀𝐃𝐃𝐄𝐃 𝐍𝐎𝐓𝐈𝐂𝐄 ✅ ┃
╰━━━━━━━━━━━━━━━━━━━━╯

📢 ${ownerName} ভাই, আমাকে নতুন গ্রুপে অ্যাড করা হইছে!

╔════════════════════╗
║ 📊 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎
╚════════════════════╝
🏷️ নাম: ${threadInfo.threadName || "Unnamed Group"}
🆔 TID: ${threadID}
👥 মেম্বার: ${threadInfo.participantIDs.length} জন
👑 অ্যাডমিন: ${threadInfo.adminIDs.length} জন

╔════════════════════╗
║ 👤 𝐀𝐃𝐃𝐄𝐃 𝐁𝐘
╚════════════════════╝
📛 নাম: ${adderName}
🆔 UID: ${author}
🔗 প্রোফাইল: fb.com/${author}

⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}

━━━━━━━━━━━━━━━━━━━━━━
⚡ TONNI-AKTER এখন এই গ্রুপে এক্টিভ!`;

                    // নির্দিষ্ট নোটিফিকেশন গ্রুপে মেসেজ পাঠানো
                    await api.sendMessage(msg, NOTICE_GROUP_ID);

                    // যে গ্রুপে অ্যাড করা হয়েছে সেখানে থ্যাংক ইউ মেসেজ
                    await api.sendMessage(`✅ ধন্যবাদ ${adderName}! TONNI-AKTER এখন এই গ্রুপে এক্টিভ।\n\n/help লিখে সব কমান্ড দেখুন 🦵`, threadID);

                } catch (e) {
                    console.log("[ANTI-KICK ADD ERROR]", e.message);
                }
            }, 1500);
        }
    }

    // ═══════════════════ বট কিক করলে ═══════════════════
    if (logMessageType === "log:unsubscribe") {
        if (logMessageData.leftParticipantFbId == botID) {
            setTimeout(async () => {
                try {
                    let threadName = "Unknown Group";
                    let kickerName = "Unknown User";

                    try {
                        const threadInfo = await api.getThreadInfo(threadID);
                        threadName = threadInfo.threadName || "Unnamed Group";
                    } catch (e) {
                        console.log("[ANTI-KICK] কিক খাওয়ার পর thread info পাই নাই");
                    }

                    try {
                        const userInfo = await api.getUserInfo(author);
                        kickerName = userInfo[author]?.name || "Unknown User";
                    } catch (e) {}

                    const msg = `╭━━━━━━━━━━━━━━━━━━━━╮
┃ ⚠️ 𝐁𝐎𝐓 𝐊𝐈𝐂𝐊𝐄𝐃 𝐀𝐋𝐄𝐑𝐓 ⚠️ ┃
╰━━━━━━━━━━━━━━━━━━━━╯

🚨 ${ownerName} ভাই, আমাকে গ্রুপ থেকে কিক করা হইছে!

╔════════════════════╗
║ 📊 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎
╚════════════════════╝
🏷️ নাম: ${threadName}
🆔 TID: ${threadID}

╔════════════════════╗
║ 🔨 𝐊𝐈𝐂𝐊𝐄𝐃 𝐁𝐘
╚════════════════════╝
📛 নাম: ${kickerName}
🆔 UID: ${author}
🔗 প্রোফাইল: fb.com/${author}

⏰ সময়: ${new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" })}

━━━━━━━━━━━━━━━━━━━━━━
💡 ${kickerName} কে ব্যান করতে চাইলে /ban ${author} লিখুন
⚡ TONNI-AKTER`;

                    // নির্দিষ্ট নোটিফিকেশন গ্রুপে মেসেজ পাঠানো
                    await api.sendMessage(msg, NOTICE_GROUP_ID);

                    // লগ ফাইলে সেভ
                    const logDir = path.join(__dirname, "../../logs");
                    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

                    const logFile = path.join(logDir, "kick_log.txt");
                    const logData = `[${new Date().toISOString()}] KICKED from ${threadName} (${threadID}) by ${kickerName} (${author})\n`;
                    fs.appendFileSync(logFile, logData);

                } catch (e) {
                    console.log("[ANTI-KICK KICK ERROR]", e.message);
                }
            }, 1000);
        }
    }
};
