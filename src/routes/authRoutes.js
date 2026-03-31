import express, { Router } from "express";
const rotuer = express.Router();
import {register,login} from "../controllers/authController.js"


rounter.post("/register",register)
router.post("/login",login);

express default router;