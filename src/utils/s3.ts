import dotenv from 'dotenv'
import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3'
import { v4 as uuid } from 'uuid'

dotenv.config()

const bucketName = process.env.BUCKET_NAME

const s3 = new S3({
    endpoint: process.env.API_END_POINT,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
})

export async function uploadFile(file: any): Promise<any> {
    const fileStream = file.file

    const uploadParams: PutObjectRequest = {
        Bucket: bucketName as string,
        Body: fileStream as any,
        Key: uuid(),
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
