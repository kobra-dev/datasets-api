import { FastifyPluginAsync } from 'fastify'
import { getFileByKey, uploadFile } from '../utils/s3'

const datasets: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/dataset', function (request, reply) {
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

    /**
     *
     * TODO: Handle uploading file from url
    fastify.post('/dataset/url', async function (request: any, reply) {
        const { url } = request.body

        let file

        try {
            file = fs.createReadStream(url)
        } catch (errr) {
            reply.send({
                message: 'Fialed to parse file',
            })
        }

        const uploadResults = await uploadFile(file)

        reply.status(200).send({
            success: true,
            key: uploadResults.key,
        })
    })
    */
}

export default datasets
