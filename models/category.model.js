import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,           // Remove whitespace from both ends
        unique: true,          // Ensure category names are unique
        maxlength: [50, 'Category name cannot exceed 50 characters']
    },
}, { 
    timestamps: true
})

const Category = mongoose.model('Category', categorySchema)

export default Category