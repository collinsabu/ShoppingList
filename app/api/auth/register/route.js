import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';// Ensure you have a database connection utility
import User from "@/models/User"; // Make sure this is your User model schema

// POST method for registration
export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
  }
}
