import mongoose from "mongoose";

const categoryCollection = "Category"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    
},
    {
        timestamps: false,
    }
);

export const Category = mongoose.model(categoryCollection,categorySchema)

export default Category;