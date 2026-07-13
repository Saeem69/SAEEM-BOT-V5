const fs = require("fs-extra");
const path = require("path");

function box(title, content) {
    const formattedContent = content.split('\n')
       .map(line => `├‣ ${line}`)
       .join('\n');

    return `╭━❮ ${title} ❯━╮\n` +
           `${formattedContent}\n` +
           `├━─━─━━──━─━─━\n` +
           `├‣ BADOL-BOT-V5\n` +
           `╰━──━─━─━━─━─━❍`;
}

function validateAndLoadCommand(filePath, fileName) {
    try {
        if (require.cache[require.resolve(filePath)]) {
            delete require.cache[require.resolve(filePath)];
        }
        const cmd = require(filePath);
        if (!cmd.config ||!cmd.config.name ||!cmd.onStart) throw new Error("Invalid structure");
        if (cmd.config.credit!== "MOHAMMAD BADOL") throw new Error("Credit lock violation");
        global.commands.set(cmd.config.name, cmd);
        return { success: true, name: cmd.config.name };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    config: {
        name: "cmd",
        aliases: ["command"],
        credit: "MOHAMMAD BADOL",
        prefix: true,
        role: 1,
        cooldown: 0,
        description: "Command Management System"
    },

    onReaction: async function (api, event) {
        if (event.reaction!== "💚") return;
        const confirmKey = `cmd_confirm_${event.messageID}`;
        const data = global.msgCache.get(confirmKey);
        if (!data || event.userID!== data.senderID) return;

        try {
            await api.unsendMessage(event.messageID);
            await fs.writeFileSync(data.filePath, data.code);
            const result = validateAndLoadCommand(data.filePath, data.fileName);

            if (result.success) {
                api.setMessageReaction("✅", event.messageID, () => {}, true);
                api.sendMessage(box("✅ OVERWRITE DONE", `File: ${data.fileName}\nStatus: Updated & Loaded`), event.threadID);
            } else {
                api.setMessageReaction("⚠️", event.messageID, () => {}, true);
                api.sendMessage(box("❌ ERROR", `${result.error}`), event.threadID);
            }

            global.msgCache.delete(confirmKey);
        } catch (e) {
            api.setMessageReaction("⚠️", event.messageID, () => {}, true);
            api.sendMessage(box("❌ ERROR", `${e.message}`), event.threadID);
        }
    },

    onStart: async function (api, event, args) {
        const { threadID, senderID, messageID } = event;
        const cmdPath = __dirname;
        const action = args[0]?.toLowerCase();

        api.setMessageReaction("⏳", messageID, () => {}, true);

        if (!action) {
            return api.sendMessage(box("⚙️ CMD MANAGER",
                "Available Actions: ✔️\n" +
                "load <name> ✔️\n" +
                "unload <name> ✔️\n" +
                "loadall ✔️\n" +
                "del <name> ✔️\n" +
                "add <name.js> <code> ✔️\n" +
                "list ✔️"
            ), threadID);
        }

        try {
            switch (action) {
                case "load": {
                    const name = args[1]?.replace(".js", "");
                    if (!name) {
                        api.setMessageReaction("⚠️", messageID, () => {}, true);
                        return api.sendMessage(box("❌ ERROR", "Syntax: /cmd load <name>"), threadID);
                    }
                    const p = path.join(cmdPath, name + ".js");
                    if (!fs.existsSync(p)) {
                        api.setMessageReaction("⚠️", messageID, () => {}, true);
                        return api.sendMessage(box("❌ ERROR", "File not found"), threadID);
                    }
                    const res = validateAndLoadCommand(p, name + ".js");
                    if (res.success) {
                        api.setMessageReaction("✅", messageID, () => {}, true);
                        return api.sendMessage(box("✅ LOAD SUCCESS", `Load Done\nCmd Name: ${res.name}.js ✅\nSuccesful 🟢`), threadID);
                    }
                    api.setMessageReaction("⚠️", messageID, () => {}, true);
                    return api.sendMessage(box("❌ ERROR", res.error), threadID);
                }
                case "unload": {
                    const name = args[1]?.replace(".js", "");
                    if (!name ||!global.commands.has(name)) {
                        api.setMessageReaction("⚠️", messageID, () => {}, true);
                        return api.sendMessage(box("❌ ERROR", "Command not found/loaded"), threadID);
                    }
                    global.commands.delete(name);
                    api.setMessageReaction("✅", messageID, () => {}, true);
                    return api.sendMessage(box("⚠️ UNLOAD SUCCESS", `Unload Done\nCmd Name: ${name}.js ✅\nSuccesful 🟢`), threadID);
                }
                case "loadall": {
                    global.loadCommands();
                    api.setMessageReaction("✅", messageID, 
