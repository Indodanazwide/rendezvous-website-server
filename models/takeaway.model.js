import mongoose from 'mongoose'

const takeawayItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: [true, 'Menu item is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    // Optional: Add any item-specific notes
    specialInstructions: {
        type: String,
        trim: true,
        maxlength: [200, 'Special instructions cannot exceed 200 characters']
    }
})

const takeawaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required for takeaway']
    },
    items: [takeawayItemSchema],
    totalPrice: {
        type: Number,
        default: 0
    },
    deliveryAddress: {
        street: {
            type: String,
            trim: true,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            trim: true,
            required: [true, 'City is required']
        },
        postalCode: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true,
            default: 'United States'
        }
    },
    contactInfo: {
        phone: {
            type: String,
            trim: true,
            required: [true, 'Contact phone number is required']
        }
    },
    status: {
        type: String,
        enum: [
            'Pending', 
            'Confirmed', 
            'Preparing', 
            'Out for Delivery', 
            'Completed', 
            'Cancelled'
        ],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Online'],
        required: [true, 'Payment method is required']
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Refunded'],
        default: 'Unpaid'
    }
}, {
    timestamps: true
})

// Middleware to calculate total price before saving
takeawaySchema.pre('save', function(next) {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
    }, 0)
    next()
})

// Virtual to populate user details
takeawaySchema.virtual('userDetails', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
})

// Virtual to populate menu items
takeawaySchema.virtual('populatedItems', {
    ref: 'MenuItem',
    localField: 'items.menuItem',
    foreignField: '_id'
})

// Static method to create a new takeaway
takeawaySchema.statics.createTakeaway = async function(userId, items) {
    const takeaway = new this({
        user: userId,
        items: items
    })
    
    return await takeaway.save()
}

// Instance method to cancel takeaway
takeawaySchema.methods.cancelTakeaway = async function() {
    if (this.status !== 'Completed' && this.status !== 'Cancelled') {
        this.status = 'Cancelled'
        return await this.save()
    }
    throw new Error('Takeaway cannot be cancelled')
}

const Takeaway = mongoose.model('Takeaway', takeawaySchema)

export default Takeaway