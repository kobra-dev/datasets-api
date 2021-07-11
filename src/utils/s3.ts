import dotenv from 'dotenv'
import S3, {
    GetObjectRequest,
    HeadObjectRequest,
    PutObjectRequest,
} from 'aws-sdk/clients/s3'
import { hashString } from './helpers'

dotenv.config()

const bucketName = process.env.BUCKET_NAME

const s3 = new S3({
    endpoint: process.env.API_END_POINT,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
})

export async function uploadFile(file: any, userId: string): Promise<any> {
    const fileStream = file.file

    const uploadParams: PutObjectRequest = {
        Bucket: bucketName as string,
        Body: fileStream as any,
        Key: hashString(file.filename + '@' + userId),
    }

    return s3.upload(uploadParams).promise()
}

export async function updateFile(file: any, Key: string): Promise<any> {
    const fileStream = file.file

    const uploadParams: PutObjectRequest = {
        Bucket: bucketName as string,
        Body: fileStream as any,
        Key,
    }

    return s3.upload(uploadParams).promise()
}

export function getFileByKey(fileKey: string) {
    const get_params: GetObjectRequest = {
        Key: fileKey,
        Bucket: bucketName as string,
    }

    return s3.getObject(get_params).createReadStream()
}

export async function doesFileExists(Key: string): Promise<boolean> {
    try {
        const params: HeadObjectRequest = {
            Bucket: bucketName as string,
            Key,
        }
        const headCode = await s3.headObject(params).promise()

        if (headCode.ETag) {
            return true
        }

        return false
    } catch (error) {
        return false
    }
}

export async function deleteObject(Key: string): Promise<boolean> {
    try {
        const params = {
            Bucket: bucketName as string,
            Key,
        }

        await s3.deleteObject(params).promise()

        return true
    } catch (error) {
        return false
    }
}

//export async function createMultipart(file: any, Key: string) {
// TODO:
// Divide a file to upload into chunks
// Upload  chunk one by one
// Complete file uploading
//}
