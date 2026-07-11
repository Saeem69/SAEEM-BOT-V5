const axios = require('axios');
const linkSessions = new Map();

const imageLink = "https://drive.google.com/uc?id=1IvrkqlK3cmG-crxQk_RPet1iY0FGcwgz";

async function getStream(url) {
    try {
        const response = await axios({ method: 'GET', url: url, responseType: 'stream' });
        return response.data;
    } catch (e) { return null; }
}

async function sendBoxMessage(api, threadID, messageID, text, cacheData = null) {
    const attachment = await getStream(imageLink);
    const msgData = { body: text };
    if (attachment) msgData.attachment = attachment;

    const callback = (err, info) => {
        if (!err && cacheData && global.msgCache && info && info.messageID) {
            global.msgCache.set(info.messageID, cacheData);
        }
    };

    if (messageID) {
        return api.sendMessage(msgData, threadID, callback, messageID);
    } else {
        return api.sendMessage(msgData, threadID, callback);
    }
}

async function sendMainLinkMenu(api, threadID, messageID = null) {
    const text = "╭─❑ 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓\n" +
                 "│ 🌐 Platform Menu (50+):\n" +
                 "├──────────────────────────\n" +
                 "│ 01.WhatsApp  | 26.Xing\n" +
                 "│ 02.Telegram  | 27.Meetup\n" +
                 "│ 03.Instagram | 28.Blogger\n" +
                 "│ 04.Facebook  | 29.Myspace\n" +
                 "│ 05.Messenger | 30.LastFM\n" +
                 "│ 06.TikTok    | 31.AskFM\n" +
                 "│ 07.YouTube   | 32.Vkontakte\n" +
                 "│ 08.GitHub    | 33.Line\n" +
                 "│ 09.Twitter   | 34.Viber\n" +
                 "│ 10.Google    | 35.Behance\n" +
                 "│ 11.Discord   | 36.Dribbble\n" +
                 "│ 12.Reddit    | 37.Medium\n" +
                 "│ 13.Snapchat  | 38.SoundCloud\n" +
                 "│ 14.Pinterest | 39.Vimeo\n" +
                 "│ 15.Twitch    | 40.Wattpad\n" +
                 "│ 16.Spotify   | 41.Patreon\n" +
                 "│ 17.Threads   | 42.TGChannel\n" +
                 "│ 18.Skype     | 43.DiscordS\n" +
                 "│ 19.LinkedIn  | 44.Slack\n" +
                 "│ 20.Steam     | 45.Zoom\n" +
                 "│ 21.Quora     | 46.Trello\n" +
                 "│ 22.Tumblr    | 47.Notion\n" +
                 "│ 23.Flickr    | 48.Figma\n" +
                 "│ 24.Deviant   | 49.Upwork\n" +
                 "│ 25.IMO       | 50.Fiverr\n" +
                 "├──────────────────────────\n" +
                 "│ Reply with number to select\n" +
                 "╰──────────────────────────";

    const cacheData = { commandName: "link", step: "select_platform" };
    return sendBoxMessage(api, threadID, messageID, text, cacheData);
}

module.exports = {
    config: {
        name: "link",
        aliases: ["weblink", "url"],
        description: "Generate 50+ social media links.",
        usage: "$link",
        cooldown: 5,
        role: 0,
        prefix: true,
        credit: "MOHAMMAD BADOL"
    },

    async onStart(api, event, args) {
        return await sendMainLinkMenu(api, event.threadID, event.messageID);
    },

    async onReply(api, event, cbData) {
        const { senderID, body, threadID, messageID } = event;
        if (!body || cbData.commandName !== "link") return;
        const textTrim = body.trim();

        if (cbData.step === "select_platform") {
            const platforms = {
                "1": "whatsapp", "2": "telegram", "3": "instagram", "4": "facebook", "5": "messenger", "6": "tiktok", "7": "youtube", "8": "github", "9": "twitter", "10": "google",
                "11": "discord", "12": "reddit", "13": "snapchat", "14": "pinterest", "15": "twitch", "16": "spotify", "17": "threads", "18": "skype", "19": "linkedin", "20": "steam",
                "21": "quora", "22": "tumblr", "23": "flickr", "24": "deviantart", "25": "imo", "26": "xing", "27": "meetup", "28": "blogger", "29": "myspace", "30": "lastfm",
                "31": "askfm", "32": "vkontakte", "33": "line", "34": "viber", "35": "behance", "36": "dribbble", "37": "medium", "38": "soundcloud", "39": "vimeo", "40": "wattpad",
                "41": "patreon", "42": "telegramchannel", "43": "discordserv", "44": "slack", "45": "zoom", "46": "trello", "47": "notion", "48": "figma", "49": "upwork", "50": "fiverr"
            };

            const platform = platforms[textTrim];
            if (!platform) {
                const errText = "╭─❑ 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓\n" +
                                "│ ❌ Error:\n" +
                                "├──────────────────────────\n" +
                                "│ Invalid selection!\n" +
                                "│ Please enter a number from 1 to 50.\n" +
                                "╰──────────────────────────";
                return sendBoxMessage(api, threadID, messageID, errText);
            }

            linkSessions.set(senderID, { platform });
            const nextCache = { commandName: "link", step: "i
