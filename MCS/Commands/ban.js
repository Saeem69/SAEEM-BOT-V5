const fs = require("fs");
const path = require("path");

function box(title, content) {
    return `
╔═════════════════════╗
║        ${title}
╠═════════════════════╣
${content.split("\n").map(line => `║ ${line}`).join("\n")}
╚═════════════════════╝`;
}

module.exports = {
    config: {
        name: "ban",
        aliases: ["userban"],
        version: "1.0.0",
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "Ban a user"
    },

    onStart: async (api, event, args) => {
        const configPath = path.join(__dirname, "../../config.json");

        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        if (!config.ACCESS_CONTROL)
            config.ACCESS_CONTROL = {};

        if (!config.ACCESS_CONTROL.BANNED_USERS)
            config.ACCESS_CONTROL.BANNED_USERS = [];

        const targetID =
            event.messageReply
                ? event.messageReply.senderID
                : Object.keys(event.mentions)[0] || args[0];

        if (!targetID) {
            return api.sendMessage(
                box(
                    "❌ 𝗕𝗔𝗡 𝗘𝗥𝗥𝗢𝗥",
                    `⚠️ No user selected!

📌 Reply to a user's message
or mention a user.

Example:
$ban @user`
                ),
                event.threadID,
                event.messageID
            );
        }

        if (config.ACCESS_CONTROL.BANNED_USERS.includes(targetID)) {
            return api.sendMessage(
                box(
                    "⚠️ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗕𝗔𝗡𝗡𝗘𝗗",
                    `👤 User ID : ${targetID}

🚫 This user is already
in the banned list.`
                ),
                event.threadID,
                event.messageID
            );
        }

        let userName = "Unknown User";

        try {
            const info = await api.getUserInfo(targetID);
            if (info && info[targetID])
                userName = info[targetID].name;
        } catch (e) {}

        config.ACCESS_CONTROL.BANNED_USERS.push(targetID);

        fs.writeFileSync(
            configPath,
            JSON.stringify(config, null, 4),
            "utf-8"
        );

        if (typeof global.reloadConfig === "function")
            global.reloadConfig();

        return api.sendMessage(
            box(
                "✅ 𝗨𝗦𝗘𝗥 𝗕𝗔𝗡𝗡𝗘𝗗",
                `👤 Name : ${userName}

🆔 UID : ${targetID}

🔒 Status : Successfully Banned

🤖 Bot : SAEEM-BOT-V5

👑 Admin : ${event.senderID}

━━━━━━━━━━━━━━━━━━━━
✔️ User has been added
to the banned users list.`
            ),
            event.threadID,
            event.messageID
        );
    }
};
