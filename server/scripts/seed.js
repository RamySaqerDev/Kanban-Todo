import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

import List from "./models/List.js";
import Card from "./models/Card.js";

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await List.deleteMany();
        await Card.deleteMany();

        const lists = await List.insertMany([
            { title: 'To Do', order: 0 },
            { title: 'In Progress', order: 1 },
            { title: 'Done', order: 2 }
       ]);
       await Card.insertMany([
            {
                title: 'Set up project',
                description: 'Initialize the MERN stack and install dependencies',
                listId: lists[0]._id,  // ✅ brackets
                order: 0,
            },
            {
                title: 'Create schema',
                description: 'Design Mongoose schemas for lists and cards',
                listId: lists[0]._id,
                order: 1,
            },
            {
                title: 'Build API',
                description: 'Create Express routes for lists and cards',
                listId: lists[1]._id,
                order: 0,
            },
            {
                title: 'Connect to frontend',
                description: 'Test fetching data in React',
                listId: lists[2]._id,
                order: 0,
            }
            ]);
       console.log('Seed data inserted');
       process.exit();

    } catch (err) {
        console.error('Error seeding data', err);
        process.exit(1)
    }
};

seed();