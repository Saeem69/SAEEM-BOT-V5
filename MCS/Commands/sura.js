const path = require("path");
const fs = require("fs");

module.exports = {
    config: {
        name: "sura",
        aliases: ["quran"],
        version: "1.1.0",
        role: 0,
        credit: "MOHAMMAD BADOL",
        prefix: true,
        cooldown: 5
    },

    // মেইন ফাইলে command.onStart(api, event, commandArgs) কল হচ্ছে, তাই এখানে এভাবে নিতে হবে
    onStart: async function(api, event, args) {
        const jsonPath = path.join(__dirname, "B4D9L", "quran.json");
        if (!fs.existsSync(jsonPath)) return api.sendMessage("❌ ডেটা ফাইলটি পাওয়া যায়নি!", event.threadID);
        
        let quranData;
        try {
            quranData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        } catch (e) {
            return;
        }
        
        // args এখানে array হিসেবে আসছে (যেমন: [1])
        if (args && args.length > 0 && !isNaN(args[0])) {
            return this.showSurah(api, event, quranData, parseInt(args[0]));
        }

        let msg = `╭─❏ 📖 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓\n`;
        msg += `│ 🕌 কুরআনুল কারীম সূচিপত্র:\n`;
        quranData.forEach(s => {
            msg += `│ ${s.number}. ${s.name}\n`;
        });
        msg += `╰──────────────\n`;
        msg += `💡 𝐓𝐎 𝐑𝐄𝐀𝐃 𝐀 𝐒𝐔𝐑𝐀𝐇, 𝐑𝐄𝐏𝐋𝐘 𝐁𝐘 𝐖𝐑𝐈𝐓𝐈𝐍𝐆 𝐓𝐇𝐄 𝐒𝐔𝐑𝐀𝐇 𝐍𝐔𝐌𝐁𝐄𝐑.`;

        return api.sendMessage(msg, event.threadID, (err, info) => {
            if (!err && info && info.messageID) {
                global.msgCache.set(info.messageID, {
                    commandName: "sura",
                    senderID: event.senderID
                });
            }
        }, event.messageID);
    },

    // মেইন ফাইলে onReply(api, event, cache) কল হচ্ছে
    onReply: async function(api, event, cache) {
        const jsonPath = path.join(__dirname, "B4D9L", "quran.json");
        if (!fs.existsSync(jsonPath)) return;
        
        const quranData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        const input = parseInt(event.body);

        if (isNaN(input)) return;
        
        return module.exports.showSurah(api, event, quranData, input);
    },

    showSurah: function(api, event, data, num) {
        const surah = data.find(s => s.number === num);
        if (!surah) return api.sendMessage("❌ এই সূরার নাম্বারটি লিস্টে নেই।", event.threadID, event.messageID);

        let msg = `╭─❏ 📖 সূরা: ${surah.name}\n`;
        const limit = Math.min(surah.arabic ? surah.arabic.length : 0, 3);
        
        for (let i = 0; i < limit; i++) {
            msg += `\n│ ✨ আয়াত ${i + 1}: ${surah.arabic[i] || ""}`;
            msg += `\n│ 🗣️ উচ্চারণ: ${surah.pronunciation[i] || ""}`;
            msg += `\n│ 💎 অর্থ: ${surah.meaning[i] || ""}\n`;
        }
        msg += `╰──────────────❏\n🚀 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓`;

        return api.sendMessage(msg, event.threadID, event.messageID);
    }
};
