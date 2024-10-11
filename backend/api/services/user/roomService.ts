import { Request, Response } from "express";
import generateRandomString from "@shared/utils/generateRandomString";

export const createRoom = (req: Request, res: Response) => {
  try {
    const id = generateRandomString();
    res.status(200).json({
      success: false,
      id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
