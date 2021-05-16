import S3 from 'aws-sdk/clients/s3'
import { FastifyPluginAsync } from 'fastify'
import http from 'http'
import { v4 as uuid } from 'uuid'
import isURL from 'validator/lib/isURL'

const datasets: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const s3 = new S3({
        endpoint: process.env.API_END_POINT,
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    })

    fastify.get('/dataset', async function (request, reply) {
        reply.code(200).send({ message: ' Datasets api route' })
    })

    fastify.post('/dataset', async function (request: any, reply) {
        const data = await request.file()

        const buffer = await data.toBuffer().toString('base64')

        const params = {
            Body: buffer,
            Bucket: 'kobra',
            Key: uuid(),
        }

        s3.putObject(params, function (err: any, data: any) {
            if (err) throw new Error(err)
        })

        reply.status(201).send({
            message: 'file uploaded successfully',
            key: params.Key,
        })
    })

    fastify.get('/dataset/:key', async function (request: any, reply) {
        const params = {
            Bucket: 'kobra',
            Key: request.params.key,
        }

        //TODO: fix loading the buffer
        s3.getObject(params, async function (err, data) {
            if (err) reply.badRequest(err.message)

            let dataset: any = data.Body

            console.log({ dataset })

            dataset = dataset.toString()

            const data_decoded = Buffer.from(
                `data:image/jpeg:base64,${dataset}`,
            )
            return reply.send({ dataset: data_decoded })
        })
    })

    //TODO: update the buffer

    fastify.put('/dataset/:id', async function (request, reply) {
        reply.send({ message: 'updated' })
    })

    //TODO: Todo delete a buffer

    fastify.delete('/dataset/:id', async function (request, reply) {
        reply.send({ message: 'delete api here' })
    })

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
}

export default datasets
