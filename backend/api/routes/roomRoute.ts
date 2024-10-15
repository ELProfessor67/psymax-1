import express from "express";
import { createRoom } from "../controllers/room/roomController";

const router = express.Router();

router.route("/create-room-id").get(createRoom);

export default router;
