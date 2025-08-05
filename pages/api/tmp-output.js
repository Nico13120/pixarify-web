import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join("/tmp", "output.mp4");

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    "Content-Type": "video/mp4",
    "Content-Length": stat.size,
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}


