interface FileType {
    name: string
    size: string
    type: string
    path: string
    file: Buffer
    extension: string
    content: ArrayBuffer
}

export { FileType }
