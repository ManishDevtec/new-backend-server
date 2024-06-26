const { Rajiyo } = require("../models/HomeDisplay");
const Blog = require('../models/Blog');
const { RajiyaHelper } = require("./helper/Helper");

const getRajiyo = async (req, res) => {
    const mydata = await Rajiyo.find(req.query);
    // console.log(mydata)
    res.status(200).json(mydata);
};

const postRajiyo = async (req, res) => {
    try {
        console.log(req.body)

        const items = req.body;
        const data = new Rajiyo(items);
        const result = await data.save();
        console.log(result)
        res.status(200).json(result);
    } catch (error) {
        res.status(200).json({ message: 'error created successfully', error });
    }
}

const EditRajiyo = async (req, res) => {
    const categoriesquery = req.body.StateName;
    try {
        
        const data = RajiyaHelper(req);
        console.log(data)

        const itemId = req.params.id;
        const exitsdata = await Rajiyo.findById(itemId);



        const updatedItem = await Rajiyo.findByIdAndUpdate(itemId, data, {
            new: true, // return the modified document rather than the original
        });

        if (categoriesquery) {
            console.log('change categorie')
            const docs = await Blog.find({ Category: { $regex: `${exitsdata.StateName}` } });

            const result = await Blog.updateMany(
                { "Category": { $regex: `${exitsdata.StateName}` } },
                { $set: { "Category.$[]": `${categoriesquery}` } }, 
                { arrayFilters: [{ "element": `${exitsdata.StateName}]` }] } 
            );

            console.log(`${result.nModified} documents updated.`);
        }

        res.json(updatedItem);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const DeleteRajiyo = async (req, res) => {
    const Id = req.params.id;
    
    try {
        const result = await Rajiyo.deleteOne({ _id: Id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const MultiEditRajiyo = async (req, res) => {
    const { ids, status } = req.body;
    console.log(req.body)
    try {
        // Update the status of multiple items using updateMany
        const result = await Rajiyo.updateMany(
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

const MultiDeleteRajiyo = async (req, res) => {
    const { ids } = req.body;
    console.log(ids)
    try {
        // Use a loop to iterate through each ID and delete the corresponding item
        for (const id of ids) {
            // Perform deletion operation for each ID
            const result = await Rajiyo.findByIdAndDelete(id); // Assuming Rajiyo is your Mongoose model
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


module.exports = { getRajiyo, postRajiyo, EditRajiyo, DeleteRajiyo, MultiDeleteRajiyo,MultiEditRajiyo };
