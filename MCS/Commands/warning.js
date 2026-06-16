const fs = require("fs");
const path = require("path");

const cacheFile = path.join(__dirname, "../../cache/warning_cache.json");

const loadWarnings = () => {
    try {
        if (fs.existsSync(cacheFile)) return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    } catch (e) {}
    return {};
};

const saveWarnings = (data) => {
    try {
        const dir = path.dirname(cacheFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(cacheFile, JSON.stringify(data, null, 4), "utf-8");
    } catch (e) {}
};

module.exports = {
    config: {
        name: "warning",
        aliases: ["warn"],
        version: "1.2.0",
        credit: "MOHAMMAD BADOL",
        role: 1,
        cooldown: 3,
        prefix: true,
        category: "Admin",
        description: "Warn a user or kick them after 3 warnings with persistent memory until kicked."
    },

    onEvent: async function ({ api, event }) {
        if (event.logMessageType === "log:subscribe") {
            const { threadID, logMessageData } = event;
            const warningData = loadWarnings();
            
            if (warningData[threadID]) {
                logMessageData.addedParticipants.forEach(p => {
                    if (warningData[threadID][p.userFbId]) {
                        delete warningData[threadID][p.userFbId];
                    }
                });
                saveWarnings(warningData);
            }
        }
    },

    onStart: async function (api, event, args) {
        const { threadID, messageID, messageReply, mentions } = event;
        let targetID = null;
        let targetName = "User";

        if (messageReply && messageReply.senderID) {
            targetID = messageReply.senderID;
        } else if (mentions && Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
            targetName = mentions[targetID].replace("@", "");
        }

        if (!targetID) {
            return api.sendMessage(
                "╭─❍ [ ERROR ]\n" +
                "│ Reply to a message or\n" +
                "│ mention a user to warn.\n" +
                "╰───────────────❍", 
                threadID, messageID
            );
        }

        if (targetID === api.getCurrentUserID()) {
            return api.sendMessage(
                "╭─❍ [ ERROR ]\n" +
                "│ I cannot warn myself.\n" +
                "╰───────────────❍", 
                threadID, messageID
            );
        }

        if (targetID === "61590785637035") {
            return api.sendMessage(
                "╭─❍ [ ACCESS DENIED ]\n" +
                "│ Target is the Bot Owner!\n" +
                "╰───────────────❍", 
                threadID, messageID
            );
        }

        const warningData = loadWarnings();
        if (!warningData[threadID]) warningData[threadID] = {};
        if (!warningData[threadID][targetID]) warningData[threadID][targetID] = 0;

        warningData[threadID][targetID] += 1;
        const count = warningData[threadID][targetID];

        if (targetName === "User") {
            try {
                const info = await api.getUserInfo(targetID);
                if (info && info[targetID]) targetName = info[targetID].name;
            } catch (e) {}
        }

        if (count >= 3) {
            let kickMsg = 
                "╭─❍ [ KICK NOTICE ]\n" +
                `│ 👤 Name: ${targetName}\n` +
                `│ 🆔 ID: ${targetID}\n` +
                "│ ⚠️ Warn: 3 / 3 (Maxed)\n" +
                "├────────────────\n" +
                "│ User has been removed \n" +
                "│ for violating rules!\n" +
                "╰───────────────❍";

            api.sendMessage(kickMsg, threadID, async () => {
                try {
                    await api.removeUserFromGroup(targetID, threadID);
                    delete warningData[threadID][targetID];
                    saveWarnings(warningData);
                } catch (err) {
                    api.sendMessage(
                        "╭─❍ [ FAILED ]\n" +
                        "│ Unable to kick user.\n" +
                        "│ Make sure I am Admin.\n" +
                        "╰───────────────❍", 
                        threadID
                    );
                }
            }, messageID);

        } else {
            const reason = args.join(" ") || "Violation of group rules";
            let warnMsg = 
                "╭─❍ [ USER WARNING ]\n" +
                `│ 👤 Target: ${targetName}\n` +
                `│ 📝 Reason: ${reason}\n` +
                `│ ⚠️ Counts: ${count} / 3\n` +
                "├────────────────\n" +
                "│ Please follow rules.\n" +
                "│ Next warning may result\n" +
                "│ in an automatic kick.\n" +
                "╰───────────────❍";

            api.sendMessage(warnMsg, threadID, () => { 
                saveWarnings(warningData);
            }, messageID);
        }
    }
