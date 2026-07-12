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
        name: "banlist",
        aliases: ["userbanlist"],
        version: "1.0.0",
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "View banned users list"
    },

    onStart: async (api, event) => {

        const configPath = path.join(__dirname, "../../config.json");

        let config = JSON.parse(
            fs.readFileSync(configPath, "utf-8")
        );

        if (!config.ACCESS_CONTROL)
            config.ACCESS_CONTROL = {};

        if (!config.ACCESS_CONTROL.BANNED_USERS)
            config.ACCESS_CONTROL.BANNED_USERS = [];

        const list = config.ACCESS_CONTROL.BANNED_USERS;

        if (list.length === 0) {
            return api.sendMessage(
                box(
                    "📋 𝗕𝗔𝗡 𝗟𝗜𝗦𝗧",
                    `🚫 No banned users found.

📊 Total Banned : 0

🤖 𝗕𝗢𝗧 : 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱`
                ),
                event.threadID,
                event.messageID
            );
        }

        let text = `📊 Total Banned Users : ${list.length}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        for (let i = 0; i < list.length; i++) {

            const uid = list[i];

            try {

                const info = await api.getUserInfo(uid);
                const name = info[uid] ? info[uid].name : "Unknown User";

                text += `👤 ${i + 1}. ${name}\n`;
                text += `🆔 UID : ${uid}\n`;
                text += `━━━━━━━━━━━━━━━━━━━━\n`;

            } catch {

                text += `👤 ${i + 1}. Unknown User\n`;
                text += `🆔 UID : ${uid}\n`;
                text += `━━━━━━━━━━━━━━━━━━━━\n`;

            }

        }

        text += `\n🤖 𝗕𝗢𝗧 : 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱`;

        return api.sendMessage(
            box("📋 𝗕𝗔𝗡𝗡𝗘𝗗 𝗨𝗦𝗘𝗥𝗦", text),
            event.threadID,
            event.messageID
        );

    }
};
