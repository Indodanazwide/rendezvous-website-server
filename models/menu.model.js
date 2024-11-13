import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        maxlength: [100, 'Menu item name cannot exceed 100 characters']
    },
    image: {
        type: String,
        required: [true, 'Menu item image is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

// Virtual to populate category details
menuItemSchema.virtual('categoryDetails', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema)

export default MenuItem