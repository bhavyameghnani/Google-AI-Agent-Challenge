import { useEffect, useState } from "react";
import {
  FileAudio,
  FileText,
  Save,
  PlusCircle,
  Trash2,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditModal = ({ record, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "success" | "error" | ""

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("Finance Report");
  const [currentFiles, setCurrentFiles] = useState(null);
  const [speakers, setSpeakers] = useState([]);

  const [englishFile, setEnglishFile] = useState(null);
  const [hindiFile, sethindiFile] = useState(null);
  const [reportMdFile, setReportMdFile] = useState(null);
  const [reportPdfFile, setReportPdfFile] = useState(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_RECORDS_API;
        const res = await fetch(`${baseUrl}/records/${record.id}`);
        if (!res.ok) throw new Error("Failed to fetch record");
        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setTheme(data.theme || "Finance Report");
        setCurrentFiles(data);
        setSpeakers(data.speakers || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecord();
  }, [record.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_RECORDS_API;
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("theme", theme);
      if (speakers && speakers.length > 0)
        fd.append("speakers", JSON.stringify(speakers));
      if (englishFile)
        fd.append("english_audio", englishFile, englishFile.name);
      if (hindiFile) fd.append("hindi_audio", hindiFile, hindiFile.name);
      if (reportMdFile) fd.append("report_md", reportMdFile, reportMdFile.name);
      if (reportPdfFile)
        fd.append("report_pdf", reportPdfFile, reportPdfFile.name);

      const res = await fetch(`${baseUrl}/records/${record.id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Update failed");
      }

      const updated = await res.json();
      const mapped = {
        id: updated.id,
        englishAudio: updated.english?.filename || record.englishAudio,
        hindiAudio: updated.hindi?.filename || record.hindiAudio,
        reportMd: updated.report_md?.filename || record.reportMd,
        reportPdf: updated.report_pdf?.filename || record.reportPdf,
        uploadDate: updated.created_at || new Date().toISOString(),
      };

      setStatus("success");
      setTimeout(() => {
        setLoading(false);
        onSave(mapped);
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setLoading(false), 1200);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent
        className="
          sm:max-w-[650px]
          w-[95vw]
          max-h-[85vh]
          overflow-y-auto
          p-6
          rounded-2xl
          bg-white
          shadow-2xl
          scrollbar-thin
          scrollbar-thumb-gray-400
          scrollbar-track-gray-100
          relative
        "
      >
        {/* Overlay for loading/success/error */}
        {(loading || status === "success" || status === "error") && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-lg z-20 transition-all duration-300">
            {status === "success" ? (
              <>
                <CheckCircle className="h-10 w-10 text-green-600 mb-2" />
                <p className="text-green-700 font-medium">
                  Record updated successfully!
                </p>
              </>
            ) : status === "error" ? (
              <>
                <Trash2 className="h-10 w-10 text-red-600 mb-2" />
                <p className="text-red-700 font-medium">Update failed.</p>
              </>
            ) : (
              <>
                <div className="animate-spin border-4 border-gray-300 border-t-primary rounded-full h-10 w-10 mb-3"></div>
                <p className="text-gray-700">Saving changes...</p>
              </>
            )}
          </div>
        )}

        <DialogHeader className="border-b pb-3 mb-4">
          <DialogTitle className="text-lg font-semibold">
            Edit Record #{record.id}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the file names for this record
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File upload fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-1">
                <FileAudio className="h-4 w-4 text-primary" />
                English Audio (current:{" "}
                {currentFiles?.english?.filename || record.englishAudio})
              </Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => setEnglishFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-1">
                <FileAudio className="h-4 w-4 text-primary" />
                Hind Audio (current:{" "}
                {currentFiles?.hindi?.filename || record.hindiAudio})
              </Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => sethindiFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-accent" />
                Markdown Report (current:{" "}
                {currentFiles?.report_md?.filename || record.reportMd})
              </Label>
              <Input
                type="file"
                accept=".md,.markdown"
                onChange={(e) => setReportMdFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-accent" />
                PDF Report (current:{" "}
                {currentFiles?.report_pdf?.filename ||
                  record.reportPdf ||
                  "N/A"}
                )
              </Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setReportPdfFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Text fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-theme">Theme</Label>
              <select
                id="edit-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="Finance Report">Finance Report</option>
                <option value="Finance Topic">Finance Topic</option>
                <option value="Financial Literacy">Financial Literacy</option>
                <option value="Company Info">Company Info</option>
              </select>
            </div>
          </div>

          {/* Speakers Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Speakers</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSpeakers((s) => [...s, { title: "", description: "" }])
                }
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Speaker
              </Button>
            </div>

            <div className="space-y-3">
              {speakers.map((sp, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2">
                  <Input
                    className="col-span-5"
                    placeholder="Name / Role"
                    value={sp.title || ""}
                    onChange={(e) =>
                      setSpeakers((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, title: e.target.value } : p
                        )
                      )
                    }
                  />
                  <Input
                    className="col-span-6"
                    placeholder="Short description"
                    value={sp.description || ""}
                    onChange={(e) =>
                      setSpeakers((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, description: e.target.value } : p
                        )
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="col-span-1"
                    onClick={() =>
                      setSpeakers((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
