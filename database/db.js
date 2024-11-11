import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function db() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        console.log('Connected to database')
        return mongoose.connection
    } catch (error) {
        console.error('Failed to connect to MongoDB Atlas:', error)
        console.error('Error details:', error.message)
        process.exit(1)
    }
}

export default db