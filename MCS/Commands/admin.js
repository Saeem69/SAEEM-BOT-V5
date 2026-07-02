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

		let msg = "╭━━〔 👑 BOT ADMIN LIST 〕━━╮\n\n";

		for (let i = 0; i < db.admins.length; i++) {

			let name = "Unknown";

			try {
				const info = await api.getUserInfo(db.admins[i]);
				name = info[db.admins[i]].name;
			} catch {}

			msg += `${i + 1}. ${name}\n🆔 ${db.admins[i]}\n\n`;
		}

		msg += "╰━━━━━━━━━━━━━━━━━━╯";

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
`╭━━〔 ADMIN PANEL 〕━━╮

$admin list
$admin add @user
$admin remove @user

Reply + $admin add
Reply + $admin remove

╰━━━━━━━━━━━━━━╯`,
			threadID,
			messageID
		);
	}

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
				"⚠️ Already Admin.",
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
`✅ Admin Added Successfully

👤 ${name}
🆔 ${target}`,
			threadID,
			messageID
		);
	}

	if (action === "remove") {

		if (!db.admins.includes(target))
			return api.sendMessage(
				"⚠️ User isn't admin.",
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
`✅ Admin Removed

👤 ${name}
🆔 ${target}`,
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
