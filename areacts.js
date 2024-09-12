const { bot, parsedJid, getRandom, setVar } = require('../lib/')

bot(
  {
    pattern: 'areacts ?(.*)',
    fromMe: true,
    desc: 'auto react to messages',
    type: 'misc',
  },
  async (message, match) => {
    if (!match)
      return await message.send(
        '> Example :\n- areact on | off\n- areact not_react 2364723@g.us\n- areact react_only 72534823@g.us\n- areact only_pm\n- areact only_group'
      )
    await setVar({ AREACT: match })
    await message.send('AREACT updated, bot restarts')
  }
)

// Specific emojis for specific keywords
const keywordEmojiMap = {
  hi: '👋',          // Reacts with "hi" emoji
  hey: '👋',         // Reacts with "hey" emoji
  massage: '👋',     // Reacts with "hi" emoji
  hello: '👋',       // Reacts with "hi" emoji
  lovely: '💗',      // Reacts with "lovely" emoji
  send: '✅',        // Reacts with check mark emoji
  'send me': '✅',   // Reacts with check mark emoji
  heart: '💗',       // Reacts with heart emoji
  sad: '😓',         // Reacts with sad emoji
  '😒': '😒',        // Reacts with the same 😒 emoji
  'good night': '🌙',// Reacts with moon emoji
  gn: '🌙',          // Reacts with moon emoji
  gd: '🌙',          // Reacts with moon emoji
  'good morning': '🌞', // Reacts with sun emoji
  gm: '🌞',          // Reacts with sun emoji
  'gd morning': '🌞',// Reacts with sun emoji
  by: '👋',          // Reacts with "tata" emoji
  bay: '👋',         // Reacts with "tata" emoji
  buy: '👋',         // Reacts with "tata" emoji
}

// Auto reaction logic
bot({ on: ['text', 'sticker'], fromMe: false, type: 'ar' }, async (message, match) => {
  const on_off = process.env.AREACT ? process.env.AREACT.includes('off') : true
  if (on_off) return
  
  const not_react_jids = process.env.AREACT && process.env.AREACT.includes('not_react')
  const not_gids = (not_react_jids && parsedJid(not_react_jids)) || []
  if (not_gids.length) {
    if (not_gids.includes(message.jid)) return
  }
  
  const react_jids = process.env.AREACT && process.env.AREACT.includes('react_only')
  const gids = (react_jids && parsedJid(react_jids)) || []
  if (gids.length) {
    if (!gids.includes(message.jid)) return
  }
  
  const onlyPm = process.env.AREACT && process.env.AREACT.includes('only_pm')
  const onlyGroup = process.env.AREACT && process.env.AREACT.includes('only_group')
  const isReact =
    !message.fromMe &&
    (onlyPm ? !message.isGroup : !onlyPm) &&
    (onlyGroup ? message.isGroup : !onlyGroup)

  if (!isReact) return

  const messageText = message.message.conversation || ''
  const isSticker = message.message.stickerMessage ? true : false

  // React to specific keywords in the message
  for (let keyword in keywordEmojiMap) {
    if (messageText.toLowerCase().includes(keyword)) {
      const react = {
        text: keywordEmojiMap[keyword],
        key: message.message.key,
      }
      return await message.send(react, {}, 'react')
    }
  }

  // React with "💗" for any message or sticker containing "lovely"
  if (messageText.toLowerCase().includes('lovely') || isSticker && messageText.toLowerCase().includes('lovely')) {
    const react = {
      text: '💗',
      key: message.message.key,
    }
    return await message.send(react, {}, 'react')
  }

  // React with "😇" to all other stickers
  if (isSticker && !messageText.toLowerCase().includes('lovely')) {
    const react = {
      text: '😇',
      key: message.message.key,
    }
    return await message.send(react, {}, 'react')
  }
})
