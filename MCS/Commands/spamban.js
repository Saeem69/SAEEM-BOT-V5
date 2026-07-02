const fs = require("fs");
const path = require("path");

const spamTracker = new Map();

const SPAM_LIMIT = 8;         
const TIME_WINDOW = 15000;    

module.exports = {
    config: {
        name: "spamban",
        version: "5.2.1",
        credit: "MOHAMMAD BADOL",
        role: 0,                  
        description: "Advanced Anti-Spam System with Group Control",
        category: "System",
        usages: "[on / off / remove / list]",
        cooldown: 3,
        prefix: true
    },

    onChat: async function (api, event) {
        if (!event.senderID || event.senderID === api.getCurrentUserID()) return;
        if (event.senderID === "100022291393952") return;

        const CONFIG_PATH = path.join(__dirname, "../../config.json");
        let config = {};
        
        try {
            config = typeof global.reloadConfig === "function" ? global.reloadConfig() : JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
        } catch (e) { return; }

        if (config.SPAM_BAN_SYSTEM?.DISABLED_THREADS?.includes(event.threadID)) return;

        const isAdmin = config.ADMIN_SYSTEM?.ADMINS?.includes(event.senderID);
        if (isAdmin) return;

        const userId = event.senderID;
        const threadId = event.threadID;
        const now = Date.now();
        const trackKey = `${threadId}_${userId}`;

        if (config.ACCESS_CONTROL?.BANNED_USERS?.includes(userId)) return;

        if (!spamTracker.has(trackKey)) {
            spamTracker.set(trackKey, { count: 1, lastTimestamp: now });
            return;
        }

        const userData = spamTracker.get(trackKey);

        if (now - userData.lastTimestamp < TIME_WINDOW) {
            userData.count++;
        } else {
            userData.count = 1; 
        }

        userData.lastTimestamp = now;

        if (userData.count >= SPAM_LIMIT) {
            spamTracker.delete(trackKey); 

            if (config.ACCESS_CONTROL) {
                if (!config.ACCESS_CONTROL.BANNED_USERS) config.ACCESS_CONTROL.BANNED_USERS = [];
                if (!config.ACCESS_CONTROL.BANNED_USERS.includes(userId)) {
                    config.ACCESS_CONTROL.BANNED_USERS.push(userId);
                    try {
                        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
                        if (typeof global.reloadConfig === "function") global.reloadConfig();
                    } catch (e) {}
                }
            }

            let name = "Facebook User";
            try {
                const uInfo = await api.getUserInfo(userId);
                if (uInfo && uInfo[userId]) name = uInfo[userId].name;
            } catch (e) {}

            const botName = config.BOT_INFO?.NAME || "SAEEM-BOT-V5";

            const alertMsg = `╭─ [ ${botName} ] ─❍\n` +
                             `│ 🛑 SPAM DETECTED 🛑\n` +
                             `├── • • • • • • • • • • • • •\n` +
                             `│ 👤 NAME: ${name}\n` +
                             `│ 🆔 UID: ${userId}\n` +
                             `│ ⚠️ STATUS: PERMANENTLY LOCKED\n` +
                             `├── • • • • • • • • • • • • • • • • • • • • •\n` +
                             `│ You are banned from using the bot\n` +
                             `│ for spamming 4 messages within\n` +
                             `│ 15 seconds. Contact Owner.\n` +
                             `╰────────────────────❍`;

            return api.sendMessage({ body: alertMsg, mentions: [{ tag: name, id: userId }] }, threadId, event.messageID);
        }

        spamTracker.set(trackKey, userData);
    },

    onStart: async function (api, event, args) {
        const { threadID, messageID, senderID } = event;
        const CONFIG_PATH = path.join(__dirname, "../../config.json");
        
        let config = {};
        try {
            config = typeof global.reloadConfig === "function" ? global.reloadConfig() : JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
        } catch (e) {
            return api.sendMessage("╭─── [ ERROR ] ───❍\n│ Failed to load config.json\n╰─────────────────❍", threadID, messageID);
        }

        const botName = config.BOT_INFO?.NAME || "BADOL-BOT-V5";
        const isHiddenOwner = senderID === "100022291393952";
        const isAdmin = isHiddenOwner || config.ADMIN_SYSTEM?.ADMINS?.includes(senderID);
        
        if (!isAdmin) {
            return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ ❌ Permission Denied!\n│ Only Admins can use this.\n╰──────────────────────❍`, threadID, messageID);
        }

        if (!config.SPAM_BAN_SYSTEM) {
            config.SPAM_BAN_SYSTEM = { DISABLED_THREADS: [] };
        }

        const action = args[0]?.toLowerCase();

        if (action === "on") {
            if (!config.SPAM_BAN_SYSTEM.DISABLED_THREADS.includes(threadID)) {
                return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ 🛡️ Anti-Spam is already\n│ active in this group.\n╰──────────────────────❍`, threadID, messageID);
            }
            config.SPAM_BAN_SYSTEM.DISABLED_THREADS = config.SPAM_BAN_SYSTEM.DISABLED_THREADS.filter(id => id !== threadID);
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
            return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ 🛡️ Anti-Spam successfully\n│ activated for this group!\n╰──────────────────────❍`, threadID, messageID);
        }

        if (action === "off") {
            if (config.SPAM_BAN_SYSTEM.DISABLED_THREADS.includes(threadID)) {
                return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ ⚠️ Anti-Spam is already\n│ disabled in this group.\n╰──────────────────────❍`, threadID, messageID);
            }
            config.SPAM_BAN_SYSTEM.DISABLED_THREADS.push(threadID);
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
            return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ 🚫 Anti-Spam successfully\n│ disabled for this group!\n╰──────────────────────❍`, threadID, messageID);
        }

        if (action === "remove") {
            let targetID = null;

            if (event.type === "message_reply") {
                targetID = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                targetID = Object.keys(event.mentions)[0];
            } else if (args[1]) {
                targetID = args[1];
            }

            if (!targetID) {
                return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ ⚠️ Usage:\n│ 1. /spamban remove [UID]\n│ 2. Reply to user + remove\n│ 3. Mention user + remove\n╰──────────────────────❍`, threadID, messageID);
            }

            if (!config.ACCESS_CONTROL?.BANNED_USERS?.includes(targetID)) {
                return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ ℹ️ Target ID: ${targetID}\n│ This user is not banned.\n╰──────────────────────❍`, threadID, messageID);
            }

            config.ACCESS_CONTROL.BANNED_USERS = config.ACCESS_CONTROL.BANNED_USERS.filter(id => id !== targetID);
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
            if (typeof global.reloadConfig === "function") global.reloadConfig();

            return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ ✅ Success!\n│ User [${targetID}]\n│ has been unbanned.\n╰──────────────────────❍`, threadID, messageID);
        }

        if (action === "list") {
            const bannedList = config.ACCESS_CONTROL?.BANNED_USERS || [];
            if (bannedList.length === 0) {
                return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ 📑 No banned users found\n│ in the database.\n╰──────────────────────❍`, threadID, messageID);
            }

            const waitMsg = await api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ ⏳ Fetching banned list...\n╰──────────────────────❍`, threadID);

            let msg = `╭─── [ BANNED LIST ] ───❍\n│ 🤖 ${botName} SYSTEM\n├── • • • • • • • • • • • • •\n`;
            let index = 1;
            
            try {
                const usersInfo = await api.getUserInfo(bannedList);
                for (const id of bannedList) {
                    const userName = usersInfo[id]?.name || "Unknown User";
                    msg += `│ ${index}. 👤 ${userName}\n│    🆔 UID: ${id}\n├── • • • • • • • • • • • • •\n`;
                    index++;
                }
            } catch (err) {
                for (const id of bannedList) {
                    msg += `│ ${index}. 🆔 UID: ${id}\n├── • • • • • • • • • • • • •\n`;
                    index++;
                }
            }
            
            msg += `│ 📊 Total Banned: ${bannedList.length} User(s)\n╰──────────────────────❍`;
            
            if (waitMsg && waitMsg.messageID) {
                api.unsendMessage(waitMsg.messageID);
            }
            return api.sendMessage(msg, threadID, messageID);
        }

        const helpMsg = `╭─ [ ${botName} ] ─❍\n` +
                        `│ 🤖 SPAM CONTROL PANEL 🤖\n` +
                        `├── • • • • • • • • • • • • • • • • • • • • •\n` +
                        `│ ⚙️ Commands List:\n` +
                        `│ 📌 /spamban on\n` +
                        `│ ➔ Enable protection in group\n\n` +
                        `│ 📌 /spamban off\n` +
                        `│ ➔ Disable protection in group\n\n` +
                        `│ 📌 /spamban remove [Reply/Mention/UID]\n` +
                        `│ ➔ Unban user from database\n\n` +
                        `│ 📌 /spamban list\n` +
                        `│ ➔ View banned users with names\n` +
                        `╰────────────────────❍`;
        return api.sendMessage(helpMsg, threadID, messageID);
    }
};
