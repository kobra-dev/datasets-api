import crypto from 'crypto'

export function hashString(name: string) {
    return crypto.createHash('sha256').update(name).digest('hex')
}
