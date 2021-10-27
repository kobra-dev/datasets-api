import { S3 } from '@aws-sdk/client-s3'
const client = new S3({ region: 'us-west-2' })

async function upload(file: Buffer) {}

async function get_object() {}

async function delete_object(key: string) {}
