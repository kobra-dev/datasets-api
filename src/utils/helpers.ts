import crypto from 'crypto'

interface FileType {
    name: string
    size: string
    type: string
    path: string
    file: Buffer
    extension: string
    content: ArrayBuffer
}

export function hashString(name: string) {
    return crypto.createHash('sha256').update(name).digest('hex')
}

export { FileType }
