import express from 'express'
import db from './database/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routers/router.js'

dotenv.config()

const server = express()
const port = process.env.PORT || 3000

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cors({ origin: '*' }))

server.use('/', router)

server.listen(port, () => {
    db()
    console.log('Server running on port', port)
})