import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export class AuthService {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert the user
            const result = await db.insert(users).values({ name, email, password: hashedPassword });
            
            // Get the user ID (handling different driver formats)
            const userId = result.insertId || (Array.isArray(result) && result[0]?.insertId) || result[0]?.id || result;
            
            // Fetch the inserted user
            const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
            
            if (!user) {
                return res.status(500).json({ message: "Failed to create user" });
            }
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(201).json({ user: userWithoutPassword, token });
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json({ message: "Error registering user" });
        }
    }
    
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await db.query.users.findFirst({ where: eq(users.email, email) });
            
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ user: userWithoutPassword, token });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Error logging in" });
        }
    }
}