const colors = {
 cyan: "\x1b[38;5;51m", 
 yellow: "\x1b[38;5;226m",
 matrixGray: "\x1b[38;5;240m", 
 green: "\x1b[38;5;46m",
 white: "\x1b[37m", 
 red: "\x1b[38;5;196m", 
 reset: "\x1b[0m"
};

const logger = {
 info: (msg) => console.log(colors.cyan + `[ INFO ] ` + colors.reset + msg),
 cmd: (msg) => console.log(colors.yellow + `[ COMMAND ] ` + colors.reset + msg),
 
 // এরর লগিং - Stack সহ দেখাবে
 error: (msg, err = null) => {
 let errorMsg = msg;
 if (err instanceof Error) {
 errorMsg += `\n${colors.red}[MESSAGE]${colors.reset} ${err.message}`;
 errorMsg += `\n${colors.red}[STACK]${colors.reset} ${err.stack}`;
 } else if (err) {
 errorMsg += `\n${colors.red}[DETAIL]${colors.reset} ${JSON.stringify(err)}`;
 }
 console.error(colors.red + `[ ERROR ] ` + colors.reset + errorMsg);
 },

 // Command এরর স্পেশাল হ্যান্ডলার
 commandError: (cmdName, event, err) => {
 const user = event.senderID || "Unknown";
 const thread = event.threadID || "Unknown";
 const body = event.body || "Unknown";
 
 console.error(colors.red + `[ CMD ERROR ] ` + colors.reset + `Command: ${cmdName}`);
 console.error(colors.matrixGray + `├─ User: ${user} | Thread: ${thread}` + colors.reset);
 console.error(colors.matrixGray + `├─ Body: ${body}` + colors.reset);
 console.error(colors.red + `└─ Error: ${err.message}` + colors.reset);
 console.error(colors.red + `[STACK] ${err.stack}` + colors.reset);
 },

 // Event এরর স্পেশাল হ্যান্ডলার 
 eventError: (eventName, event, err) => {
 console.error(colors.red + `[ EVENT ERROR ] ` + colors.reset + `Event: ${eventName}`);
 console.error(colors.matrixGray + `├─ Type: ${event.type || "Unknown"}` + colors.reset);
 console.error(colors.red + `└─ Error: ${err.message}` + colors.reset);
 console.error(colors.red + `[STACK] ${err.stack}` + colors.reset);
 },
 
 chat: (thread, user, msg) => {
 console.log(`${colors.matrixGray}[ CHAT ]${colors.reset} [T:${thread}] [U:${user}] -> ${msg}`);
 },

 // Banner একবারই দেখাবে
 autoBanner: (() => {
 let shown = false;
 return () => {
 if (shown) return; // ২য় বার কল হলে রিটার্ন
 shown = true;
 const cmdCount = global.commands ? global.commands.size : 0;
 const eventCount = global.events ? global.events.size : 0;
 logger.finalSummary(cmdCount, eventCount);
 };
 })(),

 finalSummary: (cmdCount, eventCount) => {
 const time = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka", hour12: true });
 const uptime = (process.uptime() / 60).toFixed(0) + " mins";
 const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB";
 const maxW = 48;

 console.clear();

 // লোগো সেকশন (BADOL - BOT - V5)
 console.log(colors.cyan + `
 ██████╗  █████╗ ██████╗  ██████╗ ██╗     
 ██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██║     
 ██████╔╝███████║██║  ██║██║   ██║██║     
 ██╔══██╗██╔══██║██║  ██║██║   ██║██║     
 ██████╔╝██║  ██║██████╔╝╚██████╔╝███████╗
 ╚══════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚══════╝` + colors.reset);

 console.log(colors.yellow + `
 ██████╗  ██████╗ ████████╗
 ██╔══██╗██╔═══██╗╚══██╔══╝
 ██████╔╝██║   ██║   ██║   
 ██╔══██╗██║   ██║   ██║   
 ██████╔╝╚██████╔╝   ██║   
 ╚═════╝  ╚═════╝    ╚═╝   ` + colors.reset);

 console.log(colors.green + `
 ██╗   ██╗██████╗ 
 ██║   ██║╚════██╗
 ██║   ██║ █████╔╝
 ╚██╗ ██╔╝ ╚═══██╗
  ╚████╔╝ ██████╔╝
   ╚═══╝  ╚═════╝ ` + colors.reset);

 console.log(colors.cyan + '+' + '-'.repeat(maxW) + '+');
 console.log(colors.cyan + '|' + ' '.repeat(11) + 'SYSTEM SECURITY PROTOCOL' + ' '.repeat(11) + '|');
 console.log(colors.cyan + '+' + '-'.repeat(maxW) + '+');
 
 const lines = [
 `${colors.white}BOT NAME    : ${colors.green}BADOL-BOT-V5`,
 `${colors.white}BOT PREFIX  : ${colors.yellow}${global.config?.BOT_INFO?.PREFIX || "/"}`,
 `${colors.white}STATUS      : ${colors.green}ONLINE ✅`,
 `${colors.matrixGray}${'─'.repeat(maxW - 2)}`,
 `${colors.white}BD TIME     : ${colors.cyan}${time}`,
 `${colors.white}UPTIME      : ${colors.yellow}${uptime}`,
 `${colors.white}RAM USAGE   : ${colors.yellow}${ram}`,
 `${colors.matrixGray}${'─'.repeat(maxW - 2)}`,
 `${colors.white}TOTAL CMDS  : ${colors.cyan}${cmdCount}`,
 `${colors.white}TOTAL EVENTS: ${colors.cyan}${eventCount}`
 ];

 lines.forEach(l => {
 const clean = l.replace(/\x1b\[[0-9;]*m/g, '');
 const pad = ' '.repeat(maxW - clean.length - 1);
 console.log(`${colors.cyan}| ${colors.reset}${l}${pad}${colors.cyan}|`);
 });

 console.log(colors.cyan + '+' + '-'.repeat(maxW) + '+' + colors.reset);
 
 console.log(colors.white + `
 ╔══════════════════════╗
 ║✅OWNER: MOHAMMAD BADOL✅║
 ╚══════════════════════╝` + colors.reset + "\n");
 }
};

module.exports = logger;
