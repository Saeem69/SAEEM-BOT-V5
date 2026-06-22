module.exports = {
  config: {
    name: "boxadmin",
    aliases: ["alladmin", "tagadmin", "admins"],
    version: "1.0.0",
    credit: "MOHAMMAD BADOL",
    role: 1,
    category: "box",
    description: "গ্রুপের সব অ্যাডমিনকে মেনশন করবে",
    prefix: true,
    cooldown: 5
  },

  onStart: async function ({ api, event, threadsData, args }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);

      if (!threadInfo.adminIDs || threadInfo.adminIDs.length === 0) {
        return api.sendMessage("❌ এই গ্রুপে কোনো অ্যাডমিন পাওয়া যায়নি।", event.threadID, event.messageID);
      }

      let msg = args.join(" ").trim();
      if (!msg) msg = "⚠️ গ্রুপের সকল অ্যাডমিন, আপনাদের দরকার আছে!";

      let body = `📢 ${msg}\n\n👑 Group Admin List:\n`;
      let mentions = [];
      let index = 1;

      for (const admin of threadInfo.adminIDs) {
        const uid = admin.id || admin.userID;
        let name = `Admin ${index}`;

        try {
          const userInfo = await api.getUserInfo(uid);
          name = userInfo[uid]?.name || `Admin ${index}`;
        } catch (e) {}

        body += `${index}. ${name}\n`;
        mentions.push({
          tag: name,
          id: uid
        });

        index++;
      }

      return api.sendMessage({
        body,
        mentions
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error("adminmention error:", err);
      return api.sendMessage("❌ অ্যাডমিন মেনশন করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  }
};
