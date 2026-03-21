"use client";

import { useState, useRef } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Button, Input, Card, CardBody, CardHeader, Alert, Badge } from "@/components/ui";

interface PredictionResult {
  label: string;
  confidence: number;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setResult(null);
      setUploadProgress(0);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile) {
      toast.error("Please select a valid image file (PNG, JPEG, etc.)");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    handleFileChange(selected);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
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

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 15, 90));
      }, 300);

      const res = await api.post("/api/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setResult(res.data);
      toast.success("Prediction complete!");

      // Reset after delay
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const confidencePercentage = result ? (result.confidence * 100).toFixed(1) : 0;
  const confidenceColor =
    Number(confidencePercentage) >= 80 ? "success" : Number(confidencePercentage) >= 60 ? "warning" : "danger";

  return (
    <div className="container-safe py-6 md:py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          Upload Image for Analysis
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Upload a high-quality image of the skin lesion for AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload area */}
        <Card className="lg:col-span-1 border-0">
          <CardHeader title="Select Image" subtitle="Drag and drop or click to browse" />
          <CardBody className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all
                ${dragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-neutral-300 dark:border-neutral-700"}
                ${!preview ? "cursor-pointer hover:border-primary-400" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleInputChange}
                className="hidden"
                aria-label="Upload image file"
              />

              {!preview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-4"
                >
                  <svg className="w-12 h-12 mx-auto text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-4m0 0V8m0 4H8m4 0h4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold text-neutral-700 dark:text-neutral-300">Drop image here or click to select</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">PNG, JPEG, WebP (max 10MB)</p>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">✅ Image selected</p>
                  <p className="text-xs text-neutral-500">{file?.name}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="w-full"
                  >
                    Choose Different Image
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Preview and results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image preview */}
          {preview && (
            <Card className="border-0">
              <CardHeader title="Image Preview" />
              <CardBody>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={preview}
                    alt="Selected image preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <Button
                    onClick={handleUpload}
                    disabled={loading || !preview}
                    isLoading={loading}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    {loading ? "Analyzing..." : "Run Analysis"}
                  </Button>
                  <Button
                    onClick={clearFile}
                    variant="outline"
                    size="md"
                    className="flex-1 md:flex-none"
                  >
                    Clear
                  </Button>
                </div>

                {/* Progress bar */}
                {loading && uploadProgress > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Processing</p>
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card className="border-0 border-l-4 border-success-500">
              <CardHeader title="Analysis Results" subtitle="AI Prediction Complete" />
              <CardBody className="space-y-6">
                {/* Result badge */}
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Diagnosis</p>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{result.label}</h3>
                  </div>
                  <Badge variant={confidenceColor} size="lg">
                    {confidencePercentage}%
                  </Badge>
                </div>

                {/* Confidence visualization */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Confidence Level</span>
                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{confidencePercentage}%</span>
                  </div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 bg-gradient-to-r ${
                        Number(confidencePercentage) >= 80
                          ? "from-success-500 to-success-600"
                          : Number(confidencePercentage) >= 60
                            ? "from-warning-500 to-warning-600"
                            : "from-danger-500 to-danger-600"
                      }`}
                      style={{ width: `${confidencePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Confidence info alert */}
                {Number(confidencePercentage) < 60 && (
                  <Alert variant="warning" title="Lower Confidence">
                    This prediction has lower confidence. Consider uploading a clearer image for better accuracy.
                  </Alert>
                )}

                {Number(confidencePercentage) >= 80 && (
                  <Alert variant="success" title="High Confidence">
                    This prediction has high confidence. However, always consult a healthcare professional for diagnosis.
                  </Alert>
                )}

                {/* Disclaimer */}
                <Alert variant="info" title="Important Notice">
                  This tool is for informational purposes only and should not be used as a substitute for professional medical advice.
                  Always consult with a qualified dermatologist for accurate diagnosis and treatment.
                </Alert>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
