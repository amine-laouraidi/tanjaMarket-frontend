
import { v2 as cloudinary } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: "tangamarket" },
    process.env.CLOUDINARY_API_SECRET,
  );

  return Response.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
