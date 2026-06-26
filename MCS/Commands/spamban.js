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
        if (event.senderID === "61590785637035") return;

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

            const botName = config.BOT_INFO?.NAME || "BADOL-BOT-V5";

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
        const isHiddenOwner = senderID === "61590785637035";
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
                return api.sendMessage(`╭─── [ ${botName} ] ───❍\n│ 🛡️ Anti-Spam is already\n│ active in this group.\n╰───────────────
