"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Choisis un fichier d'abord !");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/pixarify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl); // on récupère l'URL générée
      } else {
        alert("Erreur : " + (data.error || "inconnue"));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-purple-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[400px]">
        <h1 className="text-2xl font-bold mb-2">🎬 Pixarify</h1>
        <p className="mb-4 text-gray-600">Transforme ton film en mode Pixar ✨</p>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "⏳ Transformation..." : "✨ Transformer en Pixar"}
        </button>

        {/* Affichage de la vidéo transformée */}
        {videoUrl && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Résultat :</h2>
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}


