// seedAdmin.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import colors from "colors"; // for console logs, optional

export default async function seedPrivilegedUsers() {
  try {
    // Define your privileged users
    const privilegedUsers = [
      {
        name: "Developer",
        email: process.env.DEV_EMAIL || "aisenh@gmail.com",
        password: process.env.DEV_PASSWORD || "Dev@123",
        role: "developer",
      },
      {
        name: "Director",
        email: process.env.DIRECTOR_EMAIL || "director@manit.ac.in",
        password: process.env.DIRECTOR_PASSWORD || "Director@123",
        role: "director",
      },
      {
        name: "Head of Department",
        email: process.env.HOD_EMAIL || "hod@mbc.com",
        password: process.env.HOD_PASSWORD || "Hod@123",
        role: "hod",
      },
      {
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL || "admin@mbc.com",
        password: process.env.ADMIN_PASSWORD || "Admin@123",
        role: "admin",
      },
    ];

    for (let userData of privilegedUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({ ...userData, password: hashedPassword });
        console.log(
          `${userData.role} user (${userData.email}) created!`.green
        );
      } else {
        console.log(
          `${userData.role} user (${userData.email}) already exists.`.blue
        );
      }
    }

    console.log("Privileged user seeding complete.".yellow);
  } catch (error) {
    console.error(`Error seeding privileged users: ${error.message}`.red);
  }
}
