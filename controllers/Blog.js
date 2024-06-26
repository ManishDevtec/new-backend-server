const Blog = require('../models/Blog');
const { BlogHelper } = require('./helper/Helper');
const { HomeDisplay, Rajiyo } = require("../models/HomeDisplay");


const getBlog = async (req, res) => {

    console.log(req.query);

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const Category = req.query.Category || '';
        const tajasamachar = req.query.tajasamachar || '';
        const Id = req.query._id || '';
        const Status = req.query.Status || '';

        // console.log(page);
        // console.log(limit);
        // console.log(Id);

        let skip = (page - 1) * limit;
        let sortQuery
        let active
        if (Category) {
            if (Status) {
                sortQuery = { Status: Status, Category: { $regex: Category, $options: 'i' } };
            }

            else {
                sortQuery = { Category: { $regex: Category, $options: 'i' } };
            }
        }
        if (tajasamachar) {
            sortQuery = { tajasamachar: { $regex: tajasamachar, $options: 'i' } };
        }
        if (Id) {
            sortQuery = { _id: Id };
        }


        const data = await Blog.find(sortQuery).skip(skip).limit(limit).sort({ createdAt: 1 });
        res.status(200).json({ data, nbHits: data.length });

    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllBlog = async (req, res) => {

    try {

        const page = 3;

        const limit = 13;

        const block = await HomeDisplay.find({Status: 'active'})
        const rajiya = await Rajiyo.find({Status: 'active'})

        let skip = (page - 1) * limit;

        const result = [];

        for (const item of rajiya) {
            const data = await Blog.find({ Category: { $regex: item.StateName, $options: 'i' } }).limit(limit).sort({ createdAt: 1 });
            result.push(...data);
        }
        for (const item of block) {
            const data = await Blog.find({ Category: { $regex: item.SectionName, $options: 'i' } }).limit(limit).sort({ createdAt: 1 });
            result.push(...data);
        }


        // const data = await Blog.find({}).skip(skip).limit(limit).sort({ createdAt: 1 });
        // res.status(200).json({ data, nbHits: data.length });
        res.status(200).json({ data: result, nbHits: result.length });

    } catch (error) {
        res.status(500).json(error);
    }
};


const postBlog = async (req, res) => {
    try {
        const items = BlogHelper(req);
        const categ = items.Category;
        console.log(categ);

        delete items.Category;
        console.log(items);

        const createdBlogs = [];
        for (const category of categ) {
            const itemsdata = {
                ...items,
                Category: category
            };


            const result = await Blog.create(itemsdata);
            console.log(result);
            createdBlogs.push(result);
        }

        res.status(200).json({ message: 'Blogs created successfully', blogs: createdBlogs });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blogs', error });
    }
};


const EditBlog = async (req, res) => {
    try {
        const data = BlogHelper(req)
        console.log(data)
        const itemId = req.params.id;
        updatedItem = await Blog.findByIdAndUpdate(itemId, data, {
            new: true, // return the modified document rather than the original
        });
        console.log(updatedItem)
        res.status(200).json(updatedItem);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const DeleteBlog = async (req, res) => {
    const splitarray = req.params.id.split('&');
    const Id = splitarray[0];
    const Category = splitarray[1]
    console.log(splitarray)

    try {
        const result = await Blog.deleteOne({ _id: Id });
        // Check if the product was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        // Respond with a success message
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const MultiEditBlog = async (req, res) => {
    const { ids, status } = req.body;
    console.log(req.body)
    try {
        // Update the status of multiple items using updateMany
        const result = await Blog.updateMany(
            { _id: { $in: ids } }, // Match items with IDs in the provided array
            { $set: { Status: status } } // Set the new status
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'No products found with the provided IDs' });
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const MultiDeleteBlog = async (req, res) => {
    const { ids } = req.body;
    console.log(ids)
    try {
        // Use a loop to iterate through each ID and delete the corresponding item
        for (const id of ids) {
            // Perform deletion operation for each ID
            const result = await Blog.findByIdAndDelete(id); // Assuming Rajiyo is your Mongoose model
            if (result.deletedCount === 0) {
                // If the item with the specified ID is not found, return a 404 error
                return res.status(404).json({ error: `Product with ID ${id} not found` });
            }
        }

        // If all items are deleted successfully, send a success response
        res.status(200).json({ message: 'Products deleted successfully' });
    } catch (error) {
        // If an error occurs during deletion, handle it and send an error response
        console.error('Error deleting products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { getBlog, postBlog, EditBlog, DeleteBlog, MultiDeleteBlog, MultiEditBlog, getAllBlog };
