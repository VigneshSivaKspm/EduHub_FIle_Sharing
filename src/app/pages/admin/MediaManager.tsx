import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { Upload, Trash2, FileText, Film, Plus, FileVideo } from "lucide-react";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../config/firebase";

export default function MediaManager() {
  const {
    batches,
    content,
    videos,
    addContent,
    addVideo,
    deleteContent,
    deleteVideo,
  } = useData();
  const [selectedBatch, setSelectedBatch] = useState<string>(
    batches[0]?.id || "",
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const uploadFileToStorage = async (
    folder: "content" | "videos",
    file: File,
    onProgress?: (progress: number) => void,
  ) => {
    const safeName = file.name.replace(/\s+/g, "_");
    const filePath = `${folder}/${Date.now()}-${safeName}`;
    const fileRef = ref(storage, filePath);
    if (folder === "videos") {
      return new Promise<string>((resolve, reject) => {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
            onProgress?.(progress);
          },
          reject,
          async () => {
            resolve(await getDownloadURL(uploadTask.snapshot.ref));
          },
        );
      });
    }

    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const getFileBaseName = (file: File) =>
    file.name.replace(/\.[^/.]+$/, "").trim() || "Untitled";

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedBatch) {
      setError("Please select a batch.");
      return;
    }

    if (!selectedPdfFile && !selectedVideoFile) {
      setError("Please select at least one file (PDF or Video).");
      return;
    }

    try {
      setIsUploading(true);
      setVideoUploadProgress(0);
      const hasBothFiles = !!selectedPdfFile && !!selectedVideoFile;

      if (selectedPdfFile) {
        const fileUrl = await uploadFileToStorage("content", selectedPdfFile);
        const type = selectedPdfFile.name.toLowerCase().endsWith(".pdf")
          ? "pdf"
          : "doc";
        const title =
          formData.title.trim() && !hasBothFiles
            ? formData.title.trim()
            : formData.title.trim()
              ? `${formData.title.trim()} (PDF)`
              : getFileBaseName(selectedPdfFile);
        await addContent({
          title,
          description: formData.description,
          type,
          visibilityType: "BATCH",
          batchId: selectedBatch,
          fileUrl,
        });
      }

      if (selectedVideoFile) {
        const videoUrl = await uploadFileToStorage(
          "videos",
          selectedVideoFile,
          setVideoUploadProgress,
        );
        const title =
          formData.title.trim() && !hasBothFiles
            ? formData.title.trim()
            : formData.title.trim()
              ? `${formData.title.trim()} (Video)`
              : getFileBaseName(selectedVideoFile);

        await addVideo({
          title,
          description: formData.description,
          duration: "00:00",
          thumbnail: `https://placehold.co/640x360/0f172a/ffffff?text=${encodeURIComponent(title || "Video")}`,
          visibilityType: "BATCH",
          batchId: selectedBatch,
          videoUrl,
        });
      }

      setFormData({ title: "", description: "" });
      setSelectedPdfFile(null);
      setSelectedVideoFile(null);
      setVideoUploadProgress(0);
      setIsUploadDialogOpen(false);
    } catch (uploadError: any) {
      setError(uploadError?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const batchContent = selectedBatch
    ? [
        ...content.filter((c) => c.batchId === selectedBatch),
        ...videos.filter((v) => v.batchId === selectedBatch),
      ].sort(
        (a, b) =>
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
      )
    : [];

  const currentBatch = batches.find((b) => b.id === selectedBatch);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Media Manager
          </h1>
          <p className="text-slate-600 mt-1">
            Upload videos and course materials for your batches
          </p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
              <DialogDescription>Upload PDF and video together in one go</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="space-y-4 py-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="batch">Select Batch</Label>
                  <Select
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                  >
                    <SelectTrigger id="batch">
                      <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Optional: common title for selected files"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-file">PDF Document</Label>
                    <label
                      htmlFor="pdf-file"
                      className="block border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 cursor-pointer transition"
                    >
                      <FileText className="w-8 h-8 mx-auto text-red-500 mb-2" />
                      <p className="text-sm text-slate-700 font-medium">
                        Select PDF file
                      </p>
                      <p className="text-xs text-slate-500 mt-1">.pdf supported</p>
                      <input
                        id="pdf-file"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) =>
                          setSelectedPdfFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    {selectedPdfFile && (
                      <p className="text-xs text-slate-500 truncate">
                        Selected: {selectedPdfFile.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-file">Video File</Label>
                    <label
                      htmlFor="video-file"
                      className="block border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:bg-slate-50 cursor-pointer transition"
                    >
                      <FileVideo className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                      <p className="text-sm text-slate-700 font-medium">
                        Select video file
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        MP4, MOV, WebM, etc.
                      </p>
                      <input
                        id="video-file"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) =>
                          setSelectedVideoFile(e.target.files?.[0] || null)
                        }
                      />
                    </label>
                    {selectedVideoFile && (
                      <p className="text-xs text-slate-500 truncate">
                        Selected: {selectedVideoFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {isUploading && selectedVideoFile && (
                  <div className="space-y-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
                    <div className="flex items-center justify-between text-xs font-medium text-indigo-800">
                      <span>Video upload progress</span>
                      <span>{videoUploadProgress}%</span>
                    </div>
                    <Progress value={videoUploadProgress} className="h-2" />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsUploadDialogOpen(false);
                    setSelectedPdfFile(null);
                    setSelectedVideoFile(null);
                    setVideoUploadProgress(0);
                    setError("");
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Selected Media"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Batch Selection */}
      <div className="space-y-2">
        <Label htmlFor="batch-select">Select Batch to Manage</Label>
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger id="batch-select">
            <SelectValue placeholder="Select a batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Batch Info Card */}
      {currentBatch && (
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-900">
              {currentBatch.name}
            </CardTitle>
            <p className="text-sm text-indigo-800 mt-2">
              {currentBatch.description}
            </p>
            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <span className="text-indigo-600 font-semibold">
                  {currentBatch.studentCount}
                </span>
                <span className="text-indigo-800"> students enrolled</span>
              </div>
              <div>
                <span className="text-indigo-600 font-semibold">
                  {batchContent.length}
                </span>
                <span className="text-indigo-800"> media items</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Media Grid */}
      {batchContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchContent.map((item) => {
            const isVideo = "videoUrl" in item;
            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  {isVideo ? (
                    <Film className="w-12 h-12 text-indigo-600" />
                  ) : (
                    <FileText className="w-12 h-12 text-red-600" />
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge
                        className="mt-2"
                        variant={isVideo ? "default" : "secondary"}
                      >
                        {isVideo ? "Video" : "PDF"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {item.uploadDate}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    {item.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isVideo) {
                        deleteVideo(item.id);
                      } else {
                        deleteContent(item.id);
                      }
                    }}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  {"fileUrl" in item && item.fileUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => window.open(item.fileUrl, "_blank")}
                    >
                      Open File
                    </Button>
                  )}
                  {"videoUrl" in item && item.videoUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => window.open(item.videoUrl, "_blank")}
                    >
                      Play Video
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600">
              No media uploaded for this batch yet
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Upload videos and documents to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
