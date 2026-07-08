const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
    config: {
        name: "adminonly",
        aliases: ["wl"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 3,
        description: "Toggle admin only mode"
    },

    onStart: async (api, event, args) => {
        try {
            const configPath = path.join(__dirname, "../../config.json");
            const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

            const mode = args[0] === "on";

            config.ADMIN_SYSTEM.ADMIN_ONLY_MODE = mode;

            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

            // 🖼️ এখানে আপনার ছবির Direct Link দিন
            const IMAGE_URL = "https://drive.google.com/uc?export=download&id=1aWOfjCNItzeFQqR7VIU6V1heN0GU8tZr";

            const cacheDir = path.join(__dirname, "cache");
            await fs.ensureDir(cacheDir);

            const filePath = path.join(cacheDir, `adminonly_${Date.now()}.jpg`);

            const response = await axios({
                url: IMAGE_URL,
                method: "GET",
                responseType: "stream"
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            writer.on("finish", () => {
                api.sendMessage(
                    {
                        body:
`┌─[ ⚙️ ADMIN ONLY MODE ]─┐
│
│ 🔐 Status : ${mode ? "🟢 ENABLED" : "🔴 DISABLED"}
│ 👑 Changed By : Admin
│ 🤖 Bot : SAEEM-BOT-V5
│
└───────────────────⭔`,
                        attachment: fs.createReadStream(filePath)
                    },
                    event.threadID,
                    () => fs.remove(filePath),
                    event.messageID
                );
            });

            writer.on("error", () => {
                api.sendMessage(
                    `✅ Admin Only Mode ${mode ? "Enabled" : "Disabled"}`,
                    event.threadID,
                    event.messageID
                );
            });

        } catch (err) {
            console.log(err);
            api.sendMessage(
                "❌ Admin Only Mode পরিবর্তন করতে সমস্যা হয়েছে।",
                event.threadID,
                event.messageID
            );
        }
    }
};
