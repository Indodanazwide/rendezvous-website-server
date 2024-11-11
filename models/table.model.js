import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 1
    },
    seats: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        validate: {
            validator: Number.isInteger,
            message: 'Seats must be a whole number'
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        enum: ['indoor', 'outdoor', 'bar', 'terrace', 'main-room'],
        required: true
    },
    specialFeatures: {
        type: [String],
        default: [],
        enum: ['window-view', 'near-fireplace', 'private', 'wheelchair-accessible']
    },
    currentReservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        default: null
    }
}, {
    timestamps: true 
})

tableSchema.pre('save', async function(next) {
    if (this.isNew) {
        const existingTable = await this.constructor.findOne({ tableNumber: this.tableNumber })
        if (existingTable) {
            next(new Error('Table number must be unique'))
        }
    }
    next()
})

tableSchema.methods.checkAvailability = async function(requestedTime) {
    const conflictingReservation = await mongoose.model('Reservation').findOne({
        table: this._id,
        time: requestedTime,
        status: { $in: ['pending', 'confirmed'] }
    })
    
    return !conflictingReservation
}

tableSchema.statics.findAvailableTables = async function(requiredSeats, time) {
    return this.find({
        seats: { $gte: requiredSeats },
        isAvailable: true
    }).then(async (tables) => {
        const availableTables = []
        
        for (let table of tables) {
            const isAvailable = await table.checkAvailability(time)
            if (isAvailable) {
                availableTables.push(table)
            }
        }
        
        return availableTables
    })
}

const Table = mongoose.model('Table', tableSchema)

export default Table