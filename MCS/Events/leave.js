const axios = require("axios");

module.exports = {
    config: {
        name: "leave",
        credit: "MOHAMMAD BADOL"
    },

    onEvent: async (api, event) => {
        if (event.logMessageType === "log:unsubscribe") {
            const { threadID, logMessageData, author } = event;
            const leftUserID = logMessageData.leftParticipantFbId;

            // ছবির লিংক - Drive ডাউনলোড লিংক
            const imgURL = "https://drive.google.com/uc?export=download&id=1-70Qr5hsdudmMFUgvx4T7-XzV5JawPzQ";

            const getStream = async (url) => {
                try {
                    const res = await axios.get(url, { responseType: "stream" });
                    return res.data;
                } catch (e) {
                    return null;
                }
            };

            // গ্রুপের তথ্য সংগ্রহ
            const threadInfo = await api.getThreadInfo(threadID);
            const groupName = threadInfo.threadName || "এই গ্রুপ";
            const memberCount = threadInfo.participantIDs.length;

            // চলে যাওয়া মেম্বারের নাম বের করার চেষ্টা
            let leftUserName = "Unknown User";
            try {
                const userInfo = await api.getUserInfo(leftUserID);
                leftUserName = userInfo[leftUserID]?.name || "Unknown User";
            } catch (e) {}

            // কে রিমুভ করেছে (যদি থাকে)
            let actionBy = "";
            if (author!== leftUserID) {
                try {
                    const authorInfo = await api.getUserInfo(author);
                    const authorName = authorInfo[author]?.name || "Admin";
                    actionBy = `\n👤 𝗥𝗲𝗺𝗼𝘃𝗲𝗱: ${authorName}`;
                } catch (e) {}
            }

            // মেসেজ ডিজাইন
            const msg =
                `╔═══════════════════╗\n` +
                `║    👋 𝗚𝗢𝗢𝗗𝗕𝗬𝗘 👋    ║\n` +
                `╚═══════════════════╝\n\n` +
                `👤 𝗠𝗲𝗺𝗯𝗲𝗿: ${leftUserName}\n` +
                `👥 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲: ${groupName}${actionBy}\n` +
                `🔢 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗠𝗲𝗺𝗯𝗲𝗿: #${memberCount}\n\n` +
                `🌟 আমাদের সাথে থাকার জন্য ধন্যবাদ! 🌟`;

            api.sendMessage({
                body: msg,
                attachment: await getStream(imgURL)
            }, threadID);
        }
    }
};
