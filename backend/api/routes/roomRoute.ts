import express from "express";
import { createRoom } from "../services/roomService.js";

const router = express.Router();

router.route("/create-room-id").get(createRoom);

export default router;
