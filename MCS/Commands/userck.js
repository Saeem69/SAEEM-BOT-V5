module.exports = {
  config: {
    name: "userck",
    aliases: ["ghosts", "inactive"],
    description: "List inactive members who haven't messaged in 7 days.",
    usage: "",
    credit: "MOHAMMAD BADOL",
    role: 1,
    prefix: true,
    cooldown: 10
  },
  
  onStart: async function(api, event, args) {
    const { threadID } = event;
    const threadInfo = await api.getThreadInfo(threadID);
    const { participantIDs } = threadInfo;
    const botID = api.getCurrentUserID();
    
    const userMap = new Map();
    threadInfo.userInfo.forEach(user => {
      userMap.set(user.id, user.name || "Facebook User");
    });
    
    if (!global.userLastActive) global.userLastActive = new Map();
    
    const now = Date.now();
    const dayLimit = 7 * 24 * 60 * 60 * 1000;
    let inactiveUsers = [];
    let ghostUsers = [];
    
    for (const id of participantIDs) {
      if (id == botID) continue;
      
      const lastActive = global.userLastActive.get(id);
      const name = userMap.get(id) || "Unknown User";
      
      if (!lastActive) {
        ghostUsers.push(name);
      }
      else if (now - lastActive > dayLimit) {
        inactiveUsers.push({
          name,
          days: Math.floor((now - lastActive) / (24 * 60 * 60 * 1000))
        });
      }
    }
    
    let msg = `╭───❖ 𝗦𝗔𝗘𝗘𝗠-𝗕𝗢𝗧-𝗩𝟱 ❖───╮\n\n`;
    
    if (ghostUsers.length === 0 && inactiveUsers.length === 0) {
      msg += `✅ 𝗘𝘃𝗲𝗿𝘆𝗼𝗻𝗲 𝗶𝘀 𝗮𝗰𝘁𝗶𝘃𝗲!`;
    } else {
      msg += `📊 𝗚𝗿𝗼𝘂𝗽 𝗔𝗰𝘁𝗶𝘃𝗶𝘁𝘆 𝗥𝗲𝗽𝗼𝗿𝘁\n`;
      msg += `👥 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${participantIDs.length - 1}\n\n`;
      
      if (ghostUsers.length > 0) {
        msg += `👻 𝗚𝗵𝗼𝘀𝘁 𝗠𝗲𝗺𝗯𝗲𝗿𝘀 [𝗡𝗲𝘃𝗲𝗿 𝗺𝗲𝘀𝘀𝗮𝗴𝗲𝗱]:\n\n`;
        ghostUsers.slice(0, 250).forEach((name, i) => msg += `➤ ${i + 1}. ${name}\n`);
        if (ghostUsers.length > 250) msg += `... and ${ghostUsers.length - 250} more\n`;
        msg += `\n`;
      }
      
      if (inactiveUsers.length > 0) {
        msg += `💤 **Inactive 7+ Days**:\n`;
        inactiveUsers.slice(0, 250).forEach((u, i) => msg += `➤ ${i + 1}. ${u.name} - ${u.days} days ago\n`);
        if (inactiveUsers.length > 250) msg += `... and ${inactiveUsers.length - 250} more\n`;
        msg += `\n`;
      }
      
      msg += `📉 𝗧𝗼𝘁𝗮𝗹 𝗜𝗻𝗮𝗰𝘁𝗶𝘃𝗲: ${ghostUsers.length + inactiveUsers.length}`;
    }
    
    msg += `\n\n╰───────────────╯`;
    
    if (msg.length > 19000) {
      const chunks = msg.match(/.{1,19000}/gs);
      for (const chunk of chunks) {
        await api.sendMessage(chunk, threadID);
        await new Promise(r => setTimeout(r, 1000));
      }
    } else {
      api.sendMessage(msg, threadID);
    }
  },
  
  onChat: async function(api, event) {
    if (!global.userLastActive) global.userLastActive = new Map();
    if (event.type === "message" && event.senderID !== api.getCurrentUserID()) {
      global.userLastActive.set(event.senderID, Date.now());
    }
  }
};
