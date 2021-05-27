import { FastifyPluginAsync } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import fastifyMultipart from 'fastify-multipart'
import { join } from 'path'
import FireBaseAdmin from 'firebase-admin'
import fs from 'fs'
import fastfyCors from 'fastify-cors'

export type AppOptions = {} & Partial<AutoloadPluginOptions>

const firebaseConfig = fs.readFileSync('./firebase-key.json', 'utf-8')

FireBaseAdmin.initializeApp({
    credential: FireBaseAdmin.credential.cert(JSON.parse(firebaseConfig)),
})

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts,
): Promise<void> => {
    void fastify.register(fastfyCors, (instance) => (req, callback) => {
        let corsOption = { origin: true }
        callback(null, corsOption)
    })

    void fastify.addHook('onRequest', (request: any, reply, done) => {
        const token = request.headers.authorization
        let user: FireBaseAdmin.auth.DecodedIdToken | undefined = undefined

        if (token !== undefined) {
            FireBaseAdmin.auth()
                .verifyIdToken(token)
                .then((userResp) => (user = userResp))
                .catch((error) => reply.send({ message: 'Invalid auth token' }))
        } else {
            reply.send({ message: 'Not authorized' })
        }

        request.user = user

        done()
    })

    void fastify.register(fastifyMultipart, {
        limits: {
            files: 1, // Maximum number of files
            fieldSize: 1000000, // Maximum number of bytes,
            fieldNameSize: 100,
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
