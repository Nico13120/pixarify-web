import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erreur upload:", err);
        return res.status(500).json({ error: "Erreur upload fichier" });
      }

      const video = files.file;

      // Envoi vers HuggingFace
      const hfRes = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "video/mp4", // ✅ obligatoire
          },
          body: fs.createReadStream(video.filepath),
        }
      );

      if (!hfRes.ok) {
        const errText = await hfRes.text();
        console.error("Erreur HuggingFace:", errText);
        return res
          .status(500)
          .json({ error: "Erreur HuggingFace: " + errText });
      }

      // On récupère le buffer de la vidéo transformée
      const buffer = Buffer.from(await hfRes.arrayBuffer());

      // On sauvegarde temporairement dans /tmp (valable sur Vercel)
      const outputPath = "/tmp/output.mp4";
      fs.writeFileSync(outputPath, buffer);

      return res.status(200).json({
        videoUrl: "/api/tmp-output", // ⚡ on renvoie vers l’endpoint tmp-output.js
      });
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({ error: "Erreur interne" });
  }
}



