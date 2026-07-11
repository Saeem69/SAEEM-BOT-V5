const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "../../cache/lock_data.json");

const loadLocks = () => (fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8")) : {});
const saveLocks = (data) => fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 4), "utf-8");

module.exports = {
    config: {
        name: "lock",
        aliases: ["lockgroup"],
        version: "2.1.0",
        credit: "MOHAMMAD BADOL",
        role: 1,
        cooldown: 5,
        prefix: true,
        description: "Group lock system with auto-kick"
    },

    onStart: async function (api, event, args) {
        const { threadID, messageID } = event;
        let data = loadLocks();
        const action = args[0]?.toLowerCase();

        if (action === "on") {
            data[threadID] = { status: true, warnedUsers: {} };
            saveLocks(data);
            return api.sendMessage("╭─── [ SAEEM-BOT-V5 ] ───❍\n│ 🔒 গ্রুপ লক চালু হয়েছে!\n│ ৩ বার মেসেজ দিলে কিক দেওয়া হবে।\n╰─────────────────────❍", threadID, messageID);
        } else if (action === "off") {
            delete data[threadID];
            saveLocks(data);
            return api.sendMessage("╭─── [ SAEEM-BOT-V5 ] ───❍\n│ 🔓 গ্রুপ লক বন্ধ করা হয়েছে।\n╰─────────────────────❍", threadID, messageID);
        } else {
            return api.sendMessage("╭─── [ SAEEM-BOT-V5 ] ───❍\n│ 📌 ব্যবহার: $lock on | off\n╰─────────────────────❍", threadID, messageID);
        }
    },

    onChat: async function (api, event) {
        // ফিক্সড: শুধুমাত্র সাধারণ টেক্সট মেসেজ প্রসেস হবে
        if (!event || !event.threadID || event.type !== "message" || event.senderID === api.getCurrentUserID()) return;
        
        // ওনারকে ইগনোর করবে (আপনার আইডি)
        if (event.senderID === "100022291393952") return;

        let data = loadLocks();
        if (!data[event.threadID] || !data[event.threadID].status) return;

        const { senderID, threadID } = event;
        if (!data[threadID].warnedUsers) data[threadID].warnedUsers = {};

        data[threadID].warnedUsers[senderID] = (data[threadID].warnedUsers[senderID] || 0) + 1;
        let count = data[threadID].warnedUsers[senderID];

        // নাম বের করার চেষ্টা
        let name = "User";
        try {
            const info = await api.getUserInfo(senderID);
            if (info && info[senderID]) name = info[senderID].name;
        } catch (e) {}

        if (count >= 3) {
            api.removeUserFromGroup(senderID, threadID);
            api.sendMessage(`╭─── [ SAEEM-BOT-V5 ] ───❍\n│ 🚫 কিক করা হয়েছে: ${name}\n│ 🔨 কারণ: ৩ বার ওয়ার্নিংয়ের পরেও\n│ নিয়ম মানেনি!\n╰─────────────────────❍`, threadID);
            delete data[threadID].warnedUsers[senderID];
        } else {
            api.sendMessage(`╭─── [ SAEEM-BOT-V5 ] ───❍\n│ ⚠️ ওয়ার্নিং সিস্টেম\n│ 👤 টার্গেট: ${name}\n│ 📊 বর্তমান: ${count}/3\n│ ৩য় বার হলে সরাসরি কিক দেওয়া হবে!\n╰─────────────────────❍`, threadID);
        }
        saveLocks(data);
    }
};
