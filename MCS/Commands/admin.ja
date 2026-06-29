"use strict";

const fs = require("fs-extra");
const path = require("path");

const ADMIN_FILE = path.join(__dirname, "admin.json");

if (!fs.existsSync(ADMIN_FILE)) {
	fs.writeJsonSync(ADMIN_FILE, {
		admins: []
	}, {
		spaces: 2
	});
}

const loadAdmin = () => fs.readJsonSync(ADMIN_FILE);
const saveAdmin = (data) => fs.writeJsonSync(ADMIN_FILE, data, {
	spaces: 2
});

module.exports.config = {
	name: "admin",
	aliases: ["botadmin"],
	version: "1.0.0",
	credit: "MOHAMMAD BADOL",
	role: 0,
	prefix: true,
	cooldown: 3,
	description: "Bot Admin Manager",
	category: "system"
};

module.exports.onStart = async function(api, event, args) {

	const { threadID, messageID, senderID, mentions, messageReply } = event;

	const db = loadAdmin();

	if (db.admins.length === 0) {
		db.admins.push(senderID);
		saveAdmin(db);
	}

	const isAdmin = db.admins.includes(senderID);

	const action = (args[0] || "").toLowerCase();

	const target =
		messageReply?.senderID ||
		Object.keys(mentions)[0] ||
		args[1];

	if (action === "list") {

		let msg = `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃      👑 𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 𝐋𝐈𝐒𝐓     ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

`;

for (let i = 0; i < db.admins.length; i++) {
	let name = "Unknown";
	try {
		const info = await api.getUserInfo(db.admins[i]);
		name = info[db.admins[i]].name;
	} catch {}

	msg += `╭─〔 ${i + 1} 〕─────────────
👤 𝐍𝐀𝐌𝐄 : ${name}
🆔 𝐔𝐈𝐃 : ${db.admins[i]}
╰──────────────────

`;
}

msg += `━━━━━━━━━━━━━━━━━━━━━━
🤖 𝐁𝐎𝐓 : 𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓
👑 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐑 : 𝐒𝐀𝐄𝐄𝐌 𝐒𝐇𝐄𝐈𝐊𝐇
━━━━━━━━━━━━━━━━━━━━━━`;

return api.sendMessage(msg, threadID, messageID);
	}

	if (!isAdmin) {

		return api.sendMessage(
			"❌ Only Bot Admin can use this command.",
			threadID,
			messageID
		);
	}

	if (!action) {

		return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃      ⚙️ 𝐀𝐃𝐌𝐈𝐍 𝐏𝐀𝐍𝐄𝐋      ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

📜 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬

➤ $admin list
➤ $admin add @user
➤ $admin remove @user

💬 𝐘𝐨𝐮 𝐂𝐚𝐧 𝐀𝐥𝐬𝐨 𝐑𝐞𝐩𝐥𝐲:

➤ Reply + $admin add
➤ Reply + $admin remove

━━━━━━━━━━━━━━━━━━━━━━
  𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞
━━━━━━━━━━━━━━━━━━━━━━`,
threadID,
messageID
);
	if (!target) {

		return api.sendMessage(
			"⚠️ Mention অথবা Reply করুন।",
			threadID,
			messageID
		);
	}

	if (action === "add") {

		if (db.admins.includes(target))
			return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃        ⚠️ 𝐖𝐀𝐑𝐍𝐈𝐍𝐆        ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 ${name}

✅ 𝐓𝐇𝐈𝐒 𝐔𝐒𝐄𝐑 𝐈𝐒 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐀 
𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍.

━━━━━━━━━━━━━━━━━━━━━━`,
threadID,
messageID
);

		db.admins.push(target);
		saveAdmin(db);

		let name = target;

		try {
			const info = await api.getUserInfo(target);
			name = info[target].name;
		} catch {}

		return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ ✅ 𝐀𝐃𝐌𝐈𝐍 𝐀𝐃𝐃𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒  ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 𝐍𝐀𝐌𝐄 : ${name}
🆔 𝐔𝐈𝐃 : ${target}

🎉 𝐒𝐓𝐀𝐓𝐔𝐒 : Bot Admin
⚡ 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍 𝐆𝐑𝐀𝐍𝐓𝐄𝐃

━━━━━━━━━━━━━━━━━━━━━━
  𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞
━━━━━━━━━━━━━━━━━━━━━━`,
threadID,
messageID
);
	}

	if (action === "remove") {

		if (!db.admins.includes(target))
			return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃        ⚠️ 𝐖𝐀𝐑𝐍𝐈𝐍𝐆        ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

❌ 𝐓𝐇𝐈𝐒 𝐔𝐒𝐄𝐑 𝐈𝐒 𝐍𝐎𝐓 𝐀 
𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍.

━━━━━━━━━━━━━━━━━━━━━━`,
threadID,
messageID
);

		db.admins = db.admins.filter(id => id != target);
		saveAdmin(db);

		let name = target;

		try {
			const info = await api.getUserInfo(target);
			name = info[target].name;
		} catch {}

		return api.sendMessage(
`╭━━━━━━━━━━━━━━━━━━━━━━╮
┃❌ 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐌𝐎𝐕𝐄𝐃 𝐒𝐔𝐂𝐂𝐄𝐒𝐒┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 𝐍𝐀𝐌𝐄 : ${name}
🆔 𝐔𝐈𝐃 : ${target}

🚫 𝐒𝐓𝐀𝐓𝐔𝐒 : Removed
🔒 𝐏𝐄𝐑𝐌𝐈𝐒𝐒𝐈𝐎𝐍 𝐑𝐄𝐕𝐎𝐊𝐄𝐃

━━━━━━━━━━━━━━━━━━━━━━
  𝄞⋆⃝🧚𝐒𝐀𝐄𝐄𝐌-𝐁𝐎𝐓-𝐕𝟓🧚‍⋆⃝𝄞
━━━━━━━━━━━━━━━━━━━━━━`,
threadID,
messageID
);
	}

	return api.sendMessage(
		"❌ Invalid Action.",
		threadID,
		messageID
	);
};
