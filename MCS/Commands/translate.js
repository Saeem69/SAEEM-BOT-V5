const axios = require("axios");

module.exports.config = {name: "translate",aliases: ["tr"],version: "1.0.0",credit: "MOHAMMAD BADOL",role: 0,prefix: true,cooldown: 5,description: "Translate text",category: "utility"};

module.exports.onStart = async function (api, event, args) {try {

    const text = args.join(" ");

    if (!text) {
        return api.sendMessage(
            "⚠️ Example:\n/translate hello\n/tr আমি বাংলাদেশে থাকি",
            event.threadID,
            event.messageID
        );
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=bn&dt=t&q=${encodeURIComponent(text)}`;

    const res = await axios.get(url);

    const translated = res.data[0]
        .map(item => item[0])
        .join("");

    api.sendMessage(

`🌐 𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐄 𝐒𝐀𝐄𝐄𝐌 𝐁𝐎𝐓 𝐕𝟓 

📝 𝐈𝐍𝐏𝐔𝐓:${text}

✅ 𝐎𝐔𝐓𝐏𝐔𝐓:${translated}`,event.threadID,event.messageID);

} catch (e) {
    api.sendMessage(
        `❌ Error: ${e.message}`,
        event.threadID,
        event.messageID
    );
}

};

