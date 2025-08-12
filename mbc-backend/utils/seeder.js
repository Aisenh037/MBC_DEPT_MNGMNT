// utils/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Branch from '../models/Branch.js'; // Import other models as needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const adminUser = {
    name: "Admin User",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "password123",
    role: "admin",
};

const importData = async () => {
    try {
        await User.deleteMany(); // Clear existing users
        await Branch.deleteMany(); // Clear existing branches

        await User.create(adminUser);
        
        // You can add default branches here if needed
        await Branch.create([
            { name: 'MDS', department: 'MBC', capacity: 60 },
            { name: 'Bioinformatics', department: 'MBC', capacity: 30 }
        ]);

        console.log('✅ Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Branch.deleteMany();
        // Add other models to clear here
        console.log('🔥 Data Destroyed Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}