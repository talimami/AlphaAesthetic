import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import WallpaperModel from "./wallpapers.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error("MONGO_URL is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database is connected"))
  .catch((error) => console.log("Database connection failed:", error));

app.get("/wallpapers", async (req, res) => {
  try {
    const wallpapers = await WallpaperModel.find();
    res.status(200).json(wallpapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/wallpapers/:id", async (req, res) => {
  try {
    const wallpaper = await WallpaperModel.findOne({ id: req.params.id });
    if (wallpaper) {
      res.status(200).json(wallpaper);
    } else {
      res.status(404).json({ message: "Wallpaper not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/wallpapers", async (req, res) => {
  try {
    const newWallpaper = new WallpaperModel(req.body);
    const savedWallpaper = await newWallpaper.save();
    res.status(201).json(savedWallpaper);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving wallpaper", error: error.message });
  }
});

app.put("/wallpapers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedWallpaper = await WallpaperModel.findOneAndUpdate(
      { id: id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedWallpaper) {
      return res.status(404).send({ message: "Wallpaper not found." });
    }
    res.send(updatedWallpaper);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating wallpaper", error: error.toString() });
  }
});

app.delete("/wallpapers/:id", async (req, res) => {
  try {
    const deletedWallpaper = await WallpaperModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedWallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }
    res.status(200).json({
      message: "Wallpaper successfully deleted",
      wallpaper: deletedWallpaper,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
