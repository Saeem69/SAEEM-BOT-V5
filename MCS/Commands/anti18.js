"use strict";

const fs = require("fs-extra");
const path = require("path");
const https = require("https");

const DATA_PATH = path.join(__dirname, "B4D9L", "anti18.json");

if (!fs.existsSync(path.dirname(DATA_PATH)))
fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });

if (!fs.existsSync(DATA_PATH)) {
fs.writeJsonSync(DATA_PATH, {
enabled: true
}, { spaces: 2 });
}

const loadData = () => fs.readJsonSync(DATA_PATH);
const saveData = (data) => fs.writeJsonSync(DATA_PATH, data, { spaces: 2 });

const imageLinks = [
"https://i.imgur.com/B6G3NlF.jpeg",
"https://i.imgur.com/T7RtKlp.gif",
"https://i.imgur.com/BmGxEFs.gif",
"https://i.imgur.com/MEdpECT.jpeg",
"https://i.imgur.com/KU8N4Ca.jpeg",
"https://i.imgur.com/roBS6oX.gif",
"https://i.imgur.com/SkfGapy.jpeg",
"https://i.imgur.com/GGQv16z.jpeg",
"https://i.imgur.com/VAf5Eue.gif",
"https://i.imgur.com/ZZpapGi.jpeg",
"https://i.imgur.com/4LvXywY.jpeg",
"https://i.imgur.com/NZ5iyCh.jpeg",
"https://i.imgur.com/BkrKZ8b.jpeg",
"https://i.imgur.com/Yf1LRak.jpeg",
"https://i.imgur.com/1fsJf6B.jpeg",
"https://i.imgur.com/MR2h7jw.jpeg",
"https://i.imgur.com/K9fFzgm.jpeg",
"https://i.imgur.com/Se05IOn.jpeg",
"https://i.imgur.com/h1Yhryc.jpeg",
"https://i.imgur.com/sUgF4oQ.jpeg",
"https://i.imgur.com/8oHuIf8.jpeg",
"https://i.imgur.com/fiH5dUv.jpeg",
"https://i.imgur.com/FSKnHZt.jpeg",
"https://i.imgur.com/80YYI12.jpeg",
"https://i.imgur.com/ibd1j8n.jpeg",
"https://i.imgur.com/J8vbW7x.jpeg",
"https://i.imgur.com/fOmuOKl.jpeg",
"https://i.imgur.com/qDwypw6.jpeg",
"https://i.imgur.com/9dVyEEe.gif",
"https://i.imgur.com/d3yM7FX.jpeg"
];

const warningMessages = [
"🚫 দয়া করে ভদ্র ভাষায় কথা বলুন।",
"⚠️ অশালীন ভাষা ব্যবহার করবেন না।",
"🤝 সবাইকে সম্মান করুন।",
"❌ এই ধরনের শব্দ গ্রহণযোগ্য নয়।",
"💙 সুন্দর ভাষায় কথা বলুন।"
];

let downloadedImages = [];
let lastImage = null;

module.exports.config = {
name: "anti18",
aliases: ["antinsfw", "badword"],
version: "5.0.0",
credit: "MOHAMMAD BADOL",
role: 1,
prefix: true,
cooldown: 3,
description: "Anti 18+ Protection System",
category: "protection"
};

module.exports.onStart = async function (api, event, args) {

const { threadID, messageID } = event;  

const data = loadData();  

const action = (args[0] || "").toLowerCase();  

if (!action) {  

	const status = data.enabled ? "🟢 ENABLED" : "🔴 DISABLED";  

	return api.sendMessage(

`╭━━━━━━━━━━━━━━━━━━╮
┃ 🛡️ ANTI-18 SYSTEM
╰━━━━━━━━━━━━━━━━━━╯

📌 Status : ${status}

📖 Usage

➜ $anti18 on
➜ $anti18 off
➜ $anti18 status

━━━━━━━━━━━━━━━━━━
🤖 SAEEM-BOT-V5`,
threadID,
messageID
);
}

if (action === "status") {  

	return api.sendMessage(

`╭━━━━━━━━━━━━━━━━━━╮
┃ 📊 SYSTEM STATUS
╰━━━━━━━━━━━━━━━━━━╯

${data.enabled ? "🟢 Anti18 Protection Enabled" : "🔴 Anti18 Protection Disabled"}

━━━━━━━━━━━━━━━━━━
🤖 SAEEM-BOT-V5`,
threadID,
messageID
);
}

if (action === "on") {  

	data.enabled = true;  
	saveData(data);  

	return api.sendMessage(

✅ | Anti18 Protection Enabled Successfully.,
threadID,
messageID
);
}

if (action === "off") {  

	data.enabled = false;  
	saveData(data);  

	return api.sendMessage(

❌ | Anti18 Protection Disabled Successfully.,
threadID,
messageID
);
}

return api.sendMessage(

"⚠️ Invalid Command!\nUse: anti18 on/off/status",
threadID,
messageID
);
};

module.exports.onChat = async function (api, event) {

const data = loadData();  

if (!data.enabled) return;  

if (!event.body) return;  

if (event.senderID == api.getCurrentUserID()) return;  

const badWords = [  

	// English  
	"fuck","fuk","f*ck","fucking","motherfucker",  
	"sex","seggs","s3x","cum","cumming","horny",  
	"dick","d1ck","penis","p3nis","boob","boobs",  
	"pussy","vagina","nipple","porn","xxx",  
	"masturbate","masterbate","blowjob","handjob",  
	"anal","oral","nude","naked","bitch","slut",  

	// Bangla  
	"চোদ","চুদ","চুদি","চুদা","চোদা",  
	"গুদ","গুদের","ভোদা","ভোদ","যোনি",  
	"সেক্স","হস্তমৈথুন","বাঁড়া","বাড়া",  
	"ধন","স্তন","দুধ","মাল","খানকি",  
	"বেশ্যা","মাগি","নুনু","ল্যাওড়া",  
	"লাউড়া","বাল","চুষ","কাম","ঝার"  
];  

// Normalize Text  
const normalize = (text) => {  
	return text  
		.toLowerCase()  
		.replace(/[^\p{L}\p{N}]/gu, "");  
};  

const message = normalize(event.body);  

let detected = false;  

for (const word of badWords) {  

	const cleanWord = word  
		.toLowerCase()  
		.replace(/[^\p{L}\p{N}]/gu, "");  

	if (message.includes(cleanWord)) {  
		detected = true;  
		break;  
	}  
}  

if (!detected) return;  

const cacheFolder = path.join(__dirname, "cache", "anti18");  

if (!fs.existsSync(cacheFolder))  
	fs.mkdirSync(cacheFolder, { recursive: true });  

	// Download Images (Only First Time)  
for (const url of imageLinks) {  

	const fileName = path.basename(url);  
	const filePath = path.join(cacheFolder, fileName);  

	if (!fs.existsSync(filePath)) {  

		await new Promise((resolve, reject) => {  

			https.get(url, (res) => {  

				const stream = fs.createWriteStream(filePath);  

				res.pipe(stream);  

				stream.on("finish", () => {  
					stream.close(resolve);  
				});  

			}).on("error", reject);  

		}).catch(() => {});  

	}  

	if (  
		fs.existsSync(filePath) &&  
		!downloadedImages.includes(filePath)  
	) {  
		downloadedImages.push(filePath);  
	}  
}  

// No Image Found  
if (downloadedImages.length === 0) {  

	return api.sendMessage(  
		"❌ Anti18 Image Cache Not Found.",  
		event.threadID,  
		event.messageID  
	);  
}  

// Random Image  
let available = downloadedImages.filter(  
	img => img !== lastImage  
);  

if (available.length === 0)  
	available = downloadedImages;  

const selected =  
	available[Math.floor(Math.random() * available.length)];  

lastImage = selected;  

// Random Warning  
const warning =  
	warningMessages[  
		Math.floor(Math.random() * warningMessages.length)  
	];  

// Stylish Message  
const body =

`╭━━━━━━━━━━━━━━━━━━╮
┃ 🚫 𝐀𝐍𝐓𝐈-18 𝐒𝐘𝐒𝐓𝐄𝐌
╰━━━━━━━━━━━━━━━━━━╯

⚠️ ${warning}

💬 Please use respectful language.

━━━━━━━━━━━━━━━━━━
🤖 SAEEM-BOT-V5`;

try {  

	api.sendMessage(  
		{  
			body,  
			attachment: fs.createReadStream(selected)  
		},  
		event.threadID,  
		event.messageID  
	);  

} catch (e) {  

	console.log("[ANTI18 ERROR]", e);  

	api.sendMessage(  
		"❌ Failed to send warning image.",  
		event.threadID,  
		event.messageID  
	);  

}

};
