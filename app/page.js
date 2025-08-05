"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Choisis un fichier !");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/pixarify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // Ici on pointe vers notre API tmp-output
        setVideoUrl("/api/tmp-output");
      } else {
        setError(data.error || "Erreur lors du traitement.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-purple-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[90%] max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">🎬 Pixarify</h1>
        <p className="text-gray-600 mb-6">Transforme ton film en mode Pixar ✨</p>

        {!videoUrl && (
          <>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-4"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "⏳ Transformation..." : "✨ Transformer en Pixar"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {videoUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">🎉 Résultat :</h2>
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg shadow"
            />
            <a
              href={videoUrl}
              download="pixarify.mp4"
              className="mt-4 inline-block text-purple-600 underline"
            >
              ⬇️ Télécharger la vidéo
            </a>
          </div>
        )}
      </div>
    </div>
  );
}



