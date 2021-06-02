var data = 'cursed makuza mugabo verite'
var crypto = require('crypto')
const hash = crypto.createHash('sha256').update(data).digest('hex')
console.log({ hash })
