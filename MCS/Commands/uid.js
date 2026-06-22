module.exports.config = {
    name: "uid",
    version: "1.0.0",
    role: 0,
    credit: "MOHAMMAD BADOL",
    description: "Get user ID and profile picture",
    commandCategory: "info",
    usages: "uid [@mention/reply/uid]",
    cooldown: 5,
    prefix: true,
    aliases: ["id", "userid"]
};

module.exports.onStart = async function (api, event, args) {
    const { threadID, messageID, senderID, messageReply, mentions } = event;

    let targetID = senderID;
    if (messageReply) targetID = messageReply.senderID;
    else if (mentions && Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
    else if (args[0] && !isNaN(args[0])) targetID = args[0];

    try {
        const userInfo = await api.getUserInfo(targetID);
        const name = userInfo[targetID]?.name || "Facebook User";
        const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

        const msg = `╭─👤 USER INFO ─╮\n` +
                    `│ নাম: ${name}\n` +
                    `│ UID: ${targetID}\n` +
                    `╰───────────────╯`;

        return api.sendMessage({
            body: msg,
            attachment: await require("axios").get(avatarUrl, { responseType: "stream" }).then(res => res.data)
        }, threadID, messageID);

    } catch (error) {
        return api.sendMessage(`🆔 UID: ${targetID}`, threadID, messageID);
    }
};
