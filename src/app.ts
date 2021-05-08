import { FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
// import fastifyEnv from 'fastify-env'
import { join } from 'path'

export type AppOptions = {} & Partial<AutoloadPluginOptions>

// const schema = {
//     type: 'object',
//     require: ['PORT'],
//     properties: {
//         PPORT: {
//             type: 'string',
//             default: '3000',
//         },
//     },
// }

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts,
): Promise<void> => {
    // void fastify.register(fastifyEnv, {
    //     schema,
    // })

    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'plugins'),
        options: opts,
    })

    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
        options: opts,
    })
}

export default app
export { app }
