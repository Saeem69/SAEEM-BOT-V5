const axios = require("axios");

const memory = new Map();

function detectLang(text) {
 const hasBn = /[\u0980-\u09FF]/.test(text);
 const hasEn = /[a-zA-Z]/.test(text);
 if (hasBn && hasEn) return "mix";
 if (hasBn) return "bn";
 return "en";
}

function buildPrompt(history, lang) {
 let system;
 if (lang === "bn") system = "Reply short in Bangla. Be friendly and natural.";
 else if (lang === "mix") system = "Reply short in Banglish. Be friendly and natural.";
 else system = "Reply short in English. Be friendly and natural.";
 return (
 system + "\n\n" +
 history.map(x => `${x.role === "user"? "User" : "Assistant"}: ${x.content}`).join("\n") +
 "\nAssistant:"
 );
}

function cleanReply(text) {
 if (!text) return "⚠️ AI busy";
 return text
 .replace(/^"+|"+$/g, "")
 .replace(/\\n/g, " ")
 .replace(/\\/g, "")
 .replace(/\n/g, " ")
 .replace(/\s+/g, " ")
 .trim();
}

async function fetchAI(prompt) {
 try {
 const res = await axios.get("https://ai-api-sagor.vercel.app/sagor", {
 params: { key: "sagor", prompt },
 timeout: 15000
 });
 return res.data;
 } catch (e) {
 console.log("[AI FETCH ERROR]", e.message);
 return null;
 }
}

async function processAI(api, event, text, user) {
 const { threadID, messageID } = event;
 const lang = detectLang(text);
 let history = memory.get(user) || [];
 history.push({ role: "user", content: text });
 if (history.length > 3) history.shift();

 const data = await fetchAI(buildPrompt(history, lang));
 if (!data) return api.sendMessage("❌ | API Down", threadID, messageID);

 let reply = cleanReply(data.reply || data.data?.response || data.message || "⚠️ AI busy");
 history.push({ role: "ai", content: reply });
 memory.set(user, history);

 // 🟢 Catbot স্টাইলে msgCache এ সেভ
 api.sendMessage(reply, threadID, (err, info) => {
 if (!err) {
 global.msgCache.set(info.messageID, {
 body: reply,
 senderID: api.getCurrentUserID(),
 attachments: [],
 commandName: module.exports.config.name // "ai"
 });
 }
 }, messageID);
}

module.exports.config = {
 name: "ai",
 version: "3.0.0",
 role: 0,
 credit: "MOHAMMAD BADOL",
 description: "AI chat with? trigger + catbot style reply",
 prefix: false,
 category: "ai",
 aliases: ["cat", "gpt"],
 usages: "[text]",
 cooldown: 5
};

// 🟢 পুরানো সিস্টেম: ai আসসালামু আলাইকুম
module.exports.onStart = async function (api, event, args) {
 const user = event.senderID;
 const text = args.join(" ");
 const { threadID, messageID } = event;

 if (!text) return api.sendMessage("❌ | লেখ কিছু বেটা", threadID, messageID);
 await processAI(api, event, text, user);
};

// 🟢 নতুন সিস্টেম: যেকোনো মেসেজের শেষে? দিলেই কাজ করবে
module.exports.onChat = async function (api, event) {
 const { body, senderID, threadID, messageID } = event;

 if (senderID === api.getCurrentUserID()) return;
 if (!body) return;
 if (body.startsWith(global.config?.BOT_INFO?.PREFIX || "!")) return;

 const trimmedBody = body.trim();
 if (trimmedBody.endsWith("?") || trimmedBody.endsWith("？")) {
 const text = trimmedBody.slice(0, -1).trim();
 if (!text) return;
 await processAI(api, event, text, senderID);
 }
};

// 🟢 Catbot স্টাইল: AI এর যেকোনো মেসেজে যেকেউ রিপ্লাই দিতে পারবে
module.exports.onReply = async function (api, event) {
 const text = event.body;
 if (!text) return;

 // 🟢 msgCache থেকে চেক করো এইটা ai কমান্ডের মেসেজ কিনা
 const cache = global.msgCache.get(event.messageReply.messageID);
 if (!cache || cache.commandName!== module.exports.config.name) return;

 const user = event.senderID; // 🟢 যেই রিপ্লাই দিবে তার মেমোরি ইউজ হবে
 await processAI(api, event, text, user);
};
