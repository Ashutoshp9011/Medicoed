import "dotenv/config";

import express, { type Request, type Response } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import session from "express-session";
import MongoStore from "connect-mongo";

import User from "../models/user";

const app = express();

const MONGODB_URI =
  process.env.MONGODB_URI ??
  "mongodb://127.0.0.1:27017/ngoDatabase";

const SESSION_SECRET = process.env.SESSION_SECRET;
const FRONTEND_URL =
  process.env.FRONTEND_URL ?? "http://localhost:5173";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from .env");
}

// Allow requests from the React frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Store authentication sessions in MongoDB
app.use(
  session({
    name: "medicoed.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/",
    },
  })
);

// Create a fresh session after successful authentication
function createUserSession(
  req: Request,
  userId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      req.session.userId = userId;

      req.session.save((saveError) => {
        if (saveError) {
          reject(saveError);
          return;
        }

        resolve();
      });
    });
  });
}

// SIGNUP
app.post(
  "/users",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        res.status(400).json({
          message: "Name, email and password are required",
        });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({
          message: "Password must be at least 8 characters long",
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        res.status(409).json({
          message: "An account with this email already exists",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // Public signup must not allow users to assign themselves
      // admin or educator privileges.
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "student",
      });

      // Create a session after successfully creating the user
      await createUserSession(req, user._id.toString());

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: unknown) {
      console.error("Signup failed:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        res.status(409).json({
          message: "An account with this email already exists",
        });
        return;
      }

      res.status(500).json({
        message: "Failed to create user",
      });
    }
  }
);

// LOGIN
app.post(
  "/login",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
      ) {
        res.status(400).json({
          message: "Email and password are required",
        });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      const user = await User.findOne({
        email: normalizedEmail,
      }).select("+password");

      if (!user) {
        res.status(401).json({
          message: "Invalid email or password",
        });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({
          message: "This account is inactive",
        });
        return;
      }

      // Always verify the password before creating a session
      const passwordMatches = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatches) {
        res.status(401).json({
          message: "Invalid email or password",
        });
        return;
      }

      await createUserSession(req, user._id.toString());

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: unknown) {
      console.error("Login failed:", error);

      res.status(500).json({
        message: "Login failed. Please try again.",
      });
    }
  }
);

// GET CURRENT USER
app.get(
  "/me",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        res.status(401).json({
          message: "Not authenticated",
        });
        return;
      }

      const user = await User.findById(userId);

      if (!user || !user.isActive) {
        req.session.destroy(() => {});

        res.clearCookie("medicoed.sid", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        res.status(401).json({
          message: "Invalid session",
        });
        return;
      }

      res.status(200).json({
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: unknown) {
      console.error("Failed to get current user:", error);

      res.status(500).json({
        message: "Failed to retrieve current user",
      });
    }
  }
);

// LOGOUT
app.post(
  "/logout",
  (req: Request, res: Response): void => {
    req.session.destroy((error) => {
      if (error) {
        console.error("Logout failed:", error);

        res.status(500).json({
          message: "Logout failed",
        });
        return;
      }

      res.clearCookie("medicoed.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      res.status(200).json({
        message: "Logout successful",
      });
    });
  }
);

export default app;