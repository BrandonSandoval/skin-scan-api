"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setResult(null);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      toast.success("Prediction complete!");
    } catch (err: any) {
      console.error("Prediction error:", err);
      toast.error(err?.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-6 text-black">
      <h1 className="text-2xl font-bold">Upload Image for Prediction</h1>

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="block w-full max-w-xs text-sm text-gray-700 border rounded-lg cursor-pointer bg-gray-50"
      />

      {preview && (
        <div className="flex flex-col items-center">
          <img
            src={preview}
            alt="Preview"
            className="w-64 h-64 object-contain border rounded-lg shadow-md mb-4"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Run Prediction"}
          </button>
        </div>
      )}

      {result && (
        <div className="p-4 bg-white rounded-lg shadow text-center">
          <h2 className="text-lg font-bold">Prediction Result</h2>
          <p className="mt-2 text-xl">
            {result.label} ({(result.confidence * 100).toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  );
}
