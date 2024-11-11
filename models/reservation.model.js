import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    time: {
        type: Date,
        default: Date.now
    },
    guestNumber: {
        type: Number,
        min: 1,
        max: 10
    },
    tableNumber: {
        type: Number,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    specialMessage: {
        type: String,
        maxlength: 500
    }
})

const Reservation = mongoose.model('Reservation', reservationSchema)

export default Reservation