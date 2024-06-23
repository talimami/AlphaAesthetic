import mongoose from "mongoose";

const wallpaperSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Ensure it's unique
  description: { type: String, required: true },
  source: { type: String, required: true },
  imageUrl: { type: String, required: true },
  tags: [String],
});

const Wallpaper = mongoose.model("Wallpaper", wallpaperSchema, "wallpaper");

export default Wallpaper;
