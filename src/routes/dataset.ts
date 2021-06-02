import { FastifyPluginAsync } from 'fastify'
import {
    getFileByKey,
    deleteObject,
    doesFileExists,
    uploadFile,
    updateFile,
} from '../utils/s3'
import { hashString } from '../utils/helpers'

const datasets: FastifyPluginAsync = async (fastify, _): Promise<void> => {
    fastify.get('/dataset', function (_, reply) {
        reply.code(200).send({ message: ' Datasets api route' })
    })

    fastify.post('/dataset', async function (request: any, reply) {
        const data = await request.file()

        const extension = data.filename.split('.').pop()

        const allowedExtensions = ['xls', 'csv', 'xlsx', 'xlxb']

        if (!allowedExtensions.includes(extension.toLowerCase())) {
            reply.status(400).send({
                message: 'Invalid dataset file',
            })
        }

        const checkExistance = await doesFileExists(hashString(data.filename))

        if (checkExistance)
            reply.status(401).send({ message: 'Dataset already exists' })

        const uploadResult = await uploadFile(data)

        reply.status(201).send({
            message: 'file uploaded successfully',
            Key: uploadResult.key,
        })
    })

    fastify.get('/dataset/:key', async function (request: any, reply) {
        const key = request.params.key

        const readStream = getFileByKey(key)

        reply.send(readStream)
    })

    fastify.delete('/dataset/:key', async function (request: any, reply) {
        const key = request.params.key

        const doesObjectExists = await doesFileExists(key)

        if (!doesObjectExists)
            reply.status(404).send({ message: "File doesn't exists" })

        const isDeleted = await deleteObject(key)

        if (!isDeleted) reply.send({ message: 'Deleting file failed' })

        reply.status(200).send({ message: 'File deleted' })
    })

    fastify.put('/dataset/:key', async function (request: any, reply) {
        const key = request.params.key

        const data = await request.file()
        const extension = data.filename.split('.').pop()

        const allowedExtensions = ['xls', 'csv', 'xlsx', 'xlxb']

        if (!allowedExtensions.includes(extension.toLowerCase())) {
            reply.status(400).send({
                message: 'Invalid dataset file',
            })
        }

        const doesObjectExists = await doesFileExists(key)

        if (!doesObjectExists)
            reply.status(404).send({ message: "File doesn't exists" })

        const isDeleted = await deleteObject(key)

        if (!isDeleted) reply.send({ message: 'Failed to update the dataset' })

        const uploadResult = await updateFile(data, key)

        reply.status(201).send({
            message: 'file updated successfully',
            Key: uploadResult.key,
        })
    })
}

export default datasets
