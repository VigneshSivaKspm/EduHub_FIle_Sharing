import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Shield, FileText } from "lucide-react";

export default function PdfViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content } = useData();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewerUrl, setViewerUrl] = useState<string>("");
  const [viewerError, setViewerError] = useState("");

  const file = content.find((item) => item.id === id);

  useEffect(() => {
    if (!file?.fileUrl) return;

    let objectUrl = "";

    const loadPdf = async () => {
      try {
        setViewerError("");
        const response = await fetch(file.fileUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not load PDF content.");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setViewerUrl(
          `${objectUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`,
        );
      } catch (error) {
        setViewerError(
          "Protected preview could not be loaded in this browser. Try opening in Chrome or check browser security settings.",
        );
        setViewerUrl(
          `${file.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`,
        );
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file?.fileUrl]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefault = (e: Event) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        (e.ctrlKey && ["s", "p", "c", "x", "u"].includes(key)) ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        key === "f12" ||
        key === "printscreen"
      ) {
        e.preventDefault();
      }
    };

    container.addEventListener("contextmenu", preventDefault);
    container.addEventListener("copy", preventDefault);
    container.addEventListener("cut", preventDefault);
    container.addEventListener("dragstart", preventDefault);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("contextmenu", preventDefault);
      container.removeEventListener("copy", preventDefault);
      container.removeEventListener("cut", preventDefault);
      container.removeEventListener("dragstart", preventDefault);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!file || !file.fileUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            PDF not found
          </h2>
          <Button onClick={() => navigate("/student/media")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4 select-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/student/media")}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          <h1 className="text-2xl font-semibold text-slate-900">{file.title}</h1>
          <p className="text-slate-600 mt-1">{file.description}</p>
        </div>
        <Badge className="bg-indigo-600 hover:bg-indigo-600 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Protected View
        </Badge>
      </div>

      <Card className="border-slate-200 overflow-hidden">
        <CardContent className="p-0 relative">
          <iframe
            title={file.title}
            src={viewerUrl}
            className="w-full h-[78vh] bg-slate-100"
          />
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
            <div className="rounded-md bg-black/45 text-white text-xs px-3 py-1 backdrop-blur-sm">
              {user?.studentId || user?.email} | Protected Document
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Protected mode is enabled: direct download controls are disabled and
        activity is restricted inside the viewer.
      </div>
      {viewerError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {viewerError}
        </div>
      )}
    </div>
  );
}
