import Category from '../models/category.model.js'
import MenuItem from '../models/menu.model.js'
import Takeaway from '../models/takeaway.model.js'

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: 'Category created successfully!', category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Category by ID
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully!', category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create MenuItem
export const createMenuItem = async (req, res) => {
    const { name, image, price, category, description, isAvailable } = req.body;

    try {
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const menuItem = new MenuItem({
            name,
            image,
            price,
            category,
            description,
            isAvailable
        });

        await menuItem.save();
        res.status(201).json({ message: 'Menu item created successfully!', menuItem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all MenuItems
export const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().populate('category');
        res.status(200).json({ menuItems });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get MenuItem by ID
export const getMenuItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await MenuItem.findById(id).populate('category');
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ menuItem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update MenuItem
export const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, image, price, category, description, isAvailable } = req.body;

    try {
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            { name, image, price, category, description, isAvailable },
            { new: true }
        );

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json({ message: 'Menu item updated successfully!', menuItem });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete MenuItem
export const deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await MenuItem.findByIdAndDelete(id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create Takeaway
export const createTakeaway = async (req, res) => {
    const { user, items, deliveryAddress, contactInfo, paymentMethod } = req.body;

    try {
        const takeaway = await Takeaway.createTakeaway(user, items);
        takeaway.deliveryAddress = deliveryAddress;
        takeaway.contactInfo = contactInfo;
        takeaway.paymentMethod = paymentMethod;
        await takeaway.save();
        res.status(201).json({ message: 'Takeaway created successfully!', takeaway });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all Takeaways
export const getTakeaways = async (req, res) => {
    try {
        const takeaways = await Takeaway.find().populate('user').populate('populatedItems');
        res.status(200).json({ takeaways });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Takeaway by ID
export const getTakeawayById = async (req, res) => {
    const { id } = req.params;
    try {
        const takeaway = await Takeaway.findById(id).populate('user').populate('populatedItems');
        if (!takeaway) {
            return res.status(404).json({ message: 'Takeaway not found' });
        }
        res.status(200).json({ takeaway });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Takeaway Status
export const updateTakeawayStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const takeaway = await Takeaway.findById(id);
        if (!takeaway) {
            return res.status(404).json({ message: 'Takeaway not found' });
        }

        takeaway.status = status;
        await takeaway.save();
        res.status(200).json({ message: 'Takeaway status updated successfully!', takeaway });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel Takeaway
export const cancelTakeaway = async (req, res) => {
    const { id } = req.params;
    try {
        const takeaway = await Takeaway.findById(id);
        if (!takeaway) {
            return res.status(404).json({ message: 'Takeaway not found' });
        }
        await takeaway.cancelTakeaway();
        res.status(200).json({ message: 'Takeaway cancelled successfully!', takeaway });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};