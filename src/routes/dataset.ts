import { FastifyPluginAsync } from 'fastify'
import { getFileByType, uploadFile } from '../utils/s3'

const datasets: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/dataset', async function (request, reply) {
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

        const readStream = getFileByType(key)

        reply.send({ readStream })
    })

    //TODO: update the buffer
    // fastify.put('/dataset/:id', async function (request, reply) {
    //    reply.send({ message: 'updated' })
    // })

    //TODO: Todo delete a buffer

    //fastify.delete('/dataset/:id', async function (request, reply) {
    //    reply.send({ message: 'delete api here' })
    //})

    /*
 *
    fastify.post('/dataset/url', async function (request: any, reply) {
        const { url } = request.body

        if (!isURL(url))
            reply
                .status(404)
                .send({ sucess: true, message: 'Invalid url passed' })

        //TODO: fix file downloading
        const file = http.get(url, function (resp) {
            console.log(resp)
        })
        console.log({ file })

        reply.status(200).send({
            success: true,
        })
    })
    *
    */
}

export default datasets
