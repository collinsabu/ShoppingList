import { hash } from "bcryptjs";
import { MongoClient } from "mongodb";

// Create a connection to your MongoDB database
const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB);

export async function getUserByUsername(username) {
  try {
    await client.connect(); // Ensure the client is connected
    const user = await db.collection("users").findOne({ username });
    return user;
  } finally {
    await client.close(); // Close the client connection
  }
}

export async function registerUser(username, password) {
  try {
    await client.connect();
    const hashedPassword = await hash(password, 12); // Hash the password
    const newUser = { username, password: hashedPassword };

    // Save the new user in your database
    await db.collection("users").insertOne(newUser);
    return newUser;
  } finally {
    await client.close();
  }
}
