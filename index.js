/*                              DELTA-MD 𝗗𝗘𝗩𝗜𝗖𝗘 𝗕𝗢𝗧 𝗕𝗬 𝗝𝗢𝗬 𝗕𝗢𝗬 𝗦𝗘𝗥

CURRENTLY RUNNING ON BETA VERSION!!
*
   * @project_name : baileys-qr
   * @author : JoyBoySer
   * @youtube : https://www.youtube.com/JoyBoySer
   * @description : Get baileys qr, and generate short session.
   * @version 1.0.0
*/

const fs = require("fs-extra");
const pino = require("pino");
const crypto = require("crypto");
const qrcode = require("qrcode-terminal");

// =====================================================
// ============ CLEAR CACHE ON START ===================
// =====================================================

if (fs.existsSync('./auth_info_baileys')) {
  fs.emptyDirSync(__dirname + '/auth_info_baileys');
  require('child_process').exec('rm -rf auth_info_baileys');
  console.log('\nRemoving cache ...');
  setTimeout(() => console.log("Cache cleared! Run the script again."), 1500);
  setTimeout(() => process.exit(), 2000);
}

setTimeout(() => {

  const { 
    default: makeWASocket,
    useMultiFileAuthState,
    Browsers,
    delay,
    makeInMemoryStore
  } = require("@whiskeysockets/baileys");

  const store = makeInMemoryStore({ 
    logger: pino().child({ level: 'silent', stream: 'store' }) 
  });

  async function joyboyser_ʙᴀɪʟᴇʏs_ǫʀ() {

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys');

    try {

      let session = makeWASocket({
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        auth: state
      });

      session.ev.on("connection.update", async (s) => {

        const { connection, lastDisconnect } = s;

        if (connection === "open") {

          await delay(500);
          let user = session.user.id;

          // =============================================
          // SHORT SESSION ID (FOR DISPLAY ONLY)
          // =============================================
          let shortSession = "DELTA-" + crypto.randomBytes(3).toString("hex");

          console.log(`
====================  SESSION ID  ===========================
SESSION-ID ==> ${shortSession}

This is ONLY a display ID.
Your actual WhatsApp session is stored privately.
============================================================
`);

          let infoMsg = `
╔════◇
║『 *THANKS FOR CHOOSING DELTA-MD* 』
║ _You completed Step 1 to make your bot._
╚════════════════════════╝
`;

          // Send Short session to user
          let sentMsg = await session.sendMessage(user, { text: shortSession });
          await session.sendMessage(user, { text: infoMsg }, { quoted: sentMsg });

          console.log("[ ✔ ] Full WhatsApp session saved as creds.json");
          console.log("[ ✔ ] You can now deploy your bot using this session.");
          console.log("[ ✔ ] Exiting...");

          process.exit(1);
        }

        session.ev.on('creds.update', saveCreds);

        if (
          connection === "close" &&
          lastDisconnect?.error &&
          lastDisconnect.error.output?.statusCode != 401
        ) {
          joyboyser_ʙᴀɪʟᴇʏs_ǫʀ();
        }

      });

    } catch (err) {
      console.log(err);
      require('child_process').exec('rm -rf auth_info_baileys');
      process.exit(1);
    }

  }

  joyboyser_ʙᴀɪʟᴇʏs_ǫʀ();

}, 3000);
