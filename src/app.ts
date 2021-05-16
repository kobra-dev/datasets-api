import { FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import fastifyMultipart from 'fastify-multipart'
import { join } from 'path'

export type AppOptions = {} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts,
): Promise<void> => {
    void fastify.register(fastifyMultipart, {
        limits: {
            files: 1, // Maximum number of files
            fieldSize: 1000000, // Maximum number of bytess
        },
    })

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
