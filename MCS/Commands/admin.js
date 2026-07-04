const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: "admin",
    aliases: ["addadmin", "adminadd", "botadmin"],
    version: "7.0",
    credit: "MOHAMMAD BADOL",
    prefix: true,
    role: 1,
    cooldown: 3,
    category: "System",
    description: "Full admin management for all bot admins"
};

const configPath = path.join(__dirname, "../../config.json");

const loadConfig = () => JSON.parse(fs.readFileSync(configPath, "utf-8"));
const saveConfig = (config) => fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

const getUserName = async (api, uid, config) => {
    if (uid === config.OWNER_LOCK?.ID) return config.OWNER_LOCK?.NAME || "MOHAMMAD BADOL";
    try {
        const info = await api.getUserInfo(uid);
        return info[uid]?.name || "Unknown User";
    } catch (e) { return "Unknown User"; }
};

module.exports.onStart = async function (api, event, args) {
    const { senderID, threadID, mentions, messageReply } = event;
    const config = loadConfig();

    // MODERATORS অ্যারে না থাকলে তৈরি করো
    if (!config.ADMIN_SYSTEM.MODERATORS) config.ADMIN_SYSTEM.MODERATORS = [];

    const action = args[0]?.toLowerCase();
    const target = messageReply?.senderID || Object.keys(mentions)[0] || args[1];
    const isAdmin = config.ADMIN_SYSTEM.ADMINS.includes(senderID);
    const isMod = config.ADMIN_SYSTEM.MODERATORS.includes(senderID);
    const senderName = await getUserName(api, senderID, config);

    if (action === "list" || action === "all") {
        const ownerID = config.OWNER_LOCK?.ID;
        const admins = config.ADMIN_SYSTEM.ADMINS.filter(id => id!== ownerID);
        const mods = config.ADMIN_SYSTEM.MODERATORS;

        let msg = `┏━━━━━━━━━━━━━━━━━━┓\n ✨ 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱 ✨\n┗━━━━━━━━━━━━━━━━━━┛\n\n`;

        msg += `╭─❮ 🛡️ 𝗔𝗱𝗺𝗶𝗻 𝗟𝗶𝘀𝘁 ❯─╮\n`;
        if (admins.length > 0) {
            for (let i = 0; i < admins.length; i++) {
                const name = await getUserName(api, admins[i], config);
                msg += `│ ${i + 1}. ${name}\n│ 🆔 ${admins[i]}\n${i < admins.length - 1? `│ ──────────────\n` : ``}`;
            }
        } else { msg += `│ ❌ No admins found.\n`; }
        msg += `╰──────────────────╯\n\n`;

        msg += `╭─❮ ⚙️ 𝗠𝗼𝗱𝗲𝗿𝗮𝘁𝗼𝗿 𝗟𝗶𝘀𝘁 ❯─╮\n`;
        if (mods.length > 0) {
            for (let i = 0; i < mods.length; i++) {
                const name = await getUserName(api, mods[i], config);
                msg += `│ ${i + 1}. ${name}\n│ 🆔 ${mods[i]}\n${i < mods.length - 1? `│ ──────────────\n` : ``}`;
            }
        } else { msg += `│ ❌ No moderators found.\n`; }
        msg += `╰──────────────────╯\n\n💡 Use /admin addmod/removemod @tag`;

        try {
            const imageUrl = "https://drive.google.com/uc?export=download&id=1Bbvk9_sRJIR_ZpAYusPBW-_L1R_wo2_S";
            const response = await axios.get(imageUrl, { responseType: "stream" });
            return api.sendMessage({ body: msg, attachment: response.data }, threadID);
        } catch (e) { return api.sendMessage(msg, threadID); }
    }

    // শুধু Admin রা add/remove করতে পারবে
    if (action === "add" || action === "remove" || action === "addmod" || action === "removemod") {
        if (!isAdmin) return api.sendMessage("❌ Only Bot Admins can add/remove!", threadID);
    }

    // Admin/Mod দুইজনই কমান্ড ইউজ করতে পারবে
    if (!isAdmin &&!isMod) return api.sendMessage("❌ Only Admins/Mods can use this!", threadID);
    if (!target) return api.sendMessage("💡 Use: /admin add/remove @mention", threadID);

    const targetName = await getUserName(api, target, config);

    if (action === "add") {
        if (config.ADMIN_SYSTEM.ADMINS.includes(target)) return api.sendMessage(`❌ ${targetName} already admin!`, threadID);
        config.ADMIN_SYSTEM.ADMINS.push(target);
        saveConfig(config);
        try { await api.changeNickname(`[ADMIN] ${targetName}`, threadID, target); } catch (e) {}
        return api.sendMessage(`✅ Success!\n👤 ${targetName}\n⭐ Now Bot Admin\n👮 Added by: ${senderName}`, threadID);
    }
    else if (action === "remove") {
        if (target === config.OWNER_LOCK?.ID) return api.sendMessage("❌ Cannot remove Owner!", threadID);
        config.ADMIN_SYSTEM.ADMINS = config.ADMIN_SYSTEM.ADMINS.filter(id => id!== target);
        config.ADMIN_SYSTEM.MODERATORS = config.ADMIN_SYSTEM.MODERATORS.filter(id => id!== target);
        saveConfig(config);
        try { await api.changeNickname("", threadID, target); } catch (e) {}
        return api.sendMessage(`✅ REMOVED!\n👤 ${targetName}\nStatus: No longer admin/mod`, threadID);
    }
    else if (action === "addmod") {
        if (config.ADMIN_SYSTEM.MODERATORS.includes(target)) return api.sendMessage(`❌ ${targetName} already moderator!`, threadID);
        if (config.ADMIN_SYSTEM.ADMINS.includes(target)) return api.sendMessage(`❌ ${targetName} is already Admin! Remove from Admin first.`, threadID);
        config.ADMIN_SYSTEM.MODERATORS.push(target);
        saveConfig(config);
        try { await api.changeNickname(`[MOD] ${targetName}`, threadID, target); } catch (e) {}
        return api.sendMessage(`✅ Success!\n👤 ${targetName}\n⚙️ Now Moderator\n👮 Added by: ${senderName}`, threadID);
    }
    else if (action === "removemod") {
        if (!config.ADMIN_SYSTEM.MODERATORS.includes(target)) return api.sendMessage(`❌ ${targetName} is not moderator!`, threadID);
        config.ADMIN_SYSTEM.MODERATORS = config.ADMIN_SYSTEM.MODERATORS.filter(id => id!== target);
        saveConfig(config);
        try { await api.changeNickname("", threadID, target); } catch (e) {}
        return api.sendMessage(`✅ REMOVED!\n👤 ${targetName}\nStatus: No longer moderator`, threadID);
    }
};
