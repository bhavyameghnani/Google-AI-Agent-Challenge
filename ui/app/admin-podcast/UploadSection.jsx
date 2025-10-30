import { useState } from "react";
import { FileAudio, FileText, Upload, PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UploadSection = ({ onUploadComplete }) => {
  //   const { toast } = useToast();
  const [englishAudio, setEnglishAudio] = useState(null);
  const [hindiAudio, sethindiAudio] = useState(null);
  const [reportMd, setReportMd] = useState(null);
  const [reportPdf, setReportPdf] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("Finance Report");
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!englishAudio || !hindiAudio || !reportMd) {
    //   toast({
    //     title: "Missing files",
    //     description: "Please upload English audio, hindi audio, and MD report (PDF is optional)",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_RECORDS_API;

      const fd = new FormData();
      fd.append("english_audio", englishAudio, englishAudio.name);
      fd.append("hindi_audio", hindiAudio, hindiAudio.name);
      fd.append("report_md", reportMd, reportMd.name);
      if (reportPdf) fd.append("report_pdf", reportPdf, reportPdf.name);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("theme", theme);
      if (speakers && speakers.length > 0) {
        fd.append("speakers", JSON.stringify(speakers));
      }

      const res = await fetch(`${baseUrl}/records`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed: ${txt}`);
      }

      const json = await res.json();
      setUploadedInfo(json);

      //   toast({
      //     title: "Upload successful!",
      //     description: "Your files have been uploaded successfully.",
      //   });

      setEnglishAudio(null);
      sethindiAudio(null);
      setReportMd(null);
      setReportPdf(null);
      setTitle("");
      setDescription("");
      setSpeakers([]);
      e.target.reset();

      onUploadComplete();
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-16" id="upload">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Upload Your Files</h2>
          <p className="text-muted-foreground">
            Upload audio files in both English and hindi, along with your report
            documents
          </p>
        </div>

        <Card className="shadow-elevated animate-scale-in">
          <CardHeader>
            <CardTitle>File Upload Form</CardTitle>
            <CardDescription>
              All fields are required except PDF report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="english-audio"
                  className="flex items-center gap-2"
                >
                  <FileAudio className="h-4 w-4 text-primary" />
                  English Audio File *
                </Label>
                <Input
                  id="english-audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setEnglishAudio(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer"
                />
                {englishAudio && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {englishAudio.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="hindi-audio"
                  className="flex items-center gap-2"
                >
                  <FileAudio className="h-4 w-4 text-primary" />
                  hindi Audio File *
                </Label>
                <Input
                  id="hindi-audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => sethindiAudio(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer"
                />
                {hindiAudio && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {hindiAudio.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-md" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Report (Markdown) *
                </Label>
                <Input
                  id="report-md"
                  type="file"
                  accept=".md,.markdown"
                  onChange={(e) => setReportMd(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer"
                />
                {reportMd && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {reportMd.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this record"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">Speakers</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setSpeakers((s) => [...s, { title: "", description: "" }])
                    }
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Speaker
                  </Button>
                </div>
                <div className="space-y-2">
                  {speakers.map((sp, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <Input
                        className="col-span-12 sm:col-span-4"
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
                        className="col-span-12 sm:col-span-7"
                        placeholder="Short description"
                        value={sp.description || ""}
                        onChange={(e) =>
                          setSpeakers((prev) =>
                            prev.map((p, i) =>
                              i === idx
                                ? { ...p, description: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="col-span-12 sm:col-span-1"
                        onClick={() =>
                          setSpeakers((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  Report (PDF) - Optional
                </Label>
                <Input
                  id="report-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setReportPdf(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
                {reportPdf && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {reportPdf.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 shadow-card"
                size="lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload All Files
              </Button>
            </form>

            {loading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {uploadedInfo && (
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Complete</CardTitle>
                    <CardDescription>
                      Record ID: {uploadedInfo.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">Files uploaded:</p>
                    <ul className="list-disc ml-6">
                      {uploadedInfo.english && (
                        <li>
                          English:{" "}
                          <a
                            className="text-primary"
                            href={uploadedInfo.english.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.english.filename}
                          </a>
                        </li>
                      )}
                      {uploadedInfo.hindi && (
                        <li>
                          hindi:{" "}
                          <a
                            className="text-primary"
                            href={uploadedInfo.hindi.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.hindi.filename}
                          </a>
                        </li>
                      )}
                      {uploadedInfo.report_md && (
                        <li>
                          MD Report:{" "}
                          <a
                            className="text-primary"
                            href={uploadedInfo.report_md.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.report_md.filename}
                          </a>
                        </li>
                      )}
                      {uploadedInfo.report_pdf && (
                        <li>
                          PDF:{" "}
                          <a
                            className="text-primary"
                            href={uploadedInfo.report_pdf.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.report_pdf.filename}
                          </a>
                        </li>
                      )}
                    </ul>
                    <div className="mt-4">
                      <Button onClick={() => setUploadedInfo(null)}>
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default UploadSection;
