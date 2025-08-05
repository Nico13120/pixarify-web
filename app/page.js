"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pixarify", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gradient-to-br from-purple-200 to-pink-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">🎬 Pixarify</h1>
        <p className="text-gray-600 mb-6">Transforme ton film en mode Pixar ✨</p>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-xl w-full"
        >
          {loading ? "⏳ Transformation..." : "✨ Transformer en Pixar"}
        </button>

        {videoUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Résultat :</h2>
            <video src={videoUrl} controls className="rounded-xl w-full" />
            <a
              href={videoUrl}
              download
              className="block mt-2 text-blue-600 hover:underline"
            >
              ⬇️ Télécharger
            </a>
          </div>
        )}
      </div>
</main>
  );
}
