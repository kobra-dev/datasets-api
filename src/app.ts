import {FastifyPluginAsync} from 'fastify'
import AutoLoad, {AutoloadPluginOptions} from 'fastify-autoload'
// import fastifyMultipart from 'fastify-multipart'
import {join} from 'path'
import FireBaseAdmin from 'firebase-admin'
import fs from 'fs'
import fastfyCors from 'fastify-cors'

export type AppOptions = Record<string, unknown> &
    Partial<AutoloadPluginOptions>

let firebaseConfig

try {
    firebaseConfig = fs.readFileSync('./firebase-key.json', 'utf-8')
} catch (err) {
    let c = process.env.FIREBASE_CONFIG
    if (!c) throw err
    firebaseConfig = c
}

FireBaseAdmin.initializeApp({
    credential: FireBaseAdmin.credential.cert(JSON.parse(firebaseConfig)),
})

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts,
): Promise<void> => {
    void fastify.register(fastfyCors, () => (req: any, callback: any) => {
        const corsOptions = {
            credentials: true,
            allowedHeaders: [
                'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            ],
            origin: false,
        }
        const originHostname = req.headers.origin || req.ip || ''
        if (/(localhost|ngrok|127.0.0.1)/g.test(originHostname)) {
            corsOptions.origin = true
        } else {
            corsOptions.origin = true
        }
        callback(null, corsOptions)
    })

    void fastify.register(require('fastify-swagger'), {
        routePrefix: '/docs',
        swagger: {
            info: {
                title: 'dataset-api',
                description: 'datatset documentation',
                version: '0.1.0',
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here',
            },
            host: 'localhost',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                {
                    name: 'datatset',
                    description: 'datatset related end-points',
                },
            ],
            definitions: {
                datatset: {
                    type: 'object',
                    required: ['key'],
                    properties: {
                        Key: {type: 'string'},
                    },
                },
            },
            securityDefinitions: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header',
                },
            },
        },
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
        },
        staticCSP: true,
        transformStaticCSP: (header: unknown) => header,
        exposeRoute: true,
    })

    void fastify.addHook('onRequest', async (request: any, reply) => {
        const token = request.headers.authorization
        let user: FireBaseAdmin.auth.DecodedIdToken | undefined

        if (request.url !== '/docs') {
            try {
                user = await FireBaseAdmin.auth().verifyIdToken(token)
            } catch (error) {
                reply.send({message: 'Not authorized'})
            }
        }
        request.user = user
    })

    void fastify.register(require('fastify-multipart'), {
        limits: {
            files: 1, // Maximum number of files
            fieldSize: 2097152, // Maximum number of bytes(2MB),
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
export {app}
