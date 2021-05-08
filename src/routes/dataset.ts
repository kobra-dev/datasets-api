import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post('/', async function (request, reply) {
        return 'this is an example'
    })

    fastify.post('/:url', async function (request, reply) {
        return 'read from the url'
    })

    fastify.get('/:id', async function (request, reply) {
        console.log(request.params)

        return 'Hello world'
    })
}

export default example
