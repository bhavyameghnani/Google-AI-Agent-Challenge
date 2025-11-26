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
    <section className="container mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16" id="upload">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Upload Your Files</h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Upload audio files in both English and hindi, along with your report
            documents
          </p>
        </div>

        <Card className="shadow-elevated animate-scale-in">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">File Upload Form</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              All fields are required except PDF report
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="english-audio"
                  className="flex items-center gap-2 text-sm sm:text-base"
                >
                  <FileAudio className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  English Audio File *
                </Label>
                <Input
                  id="english-audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setEnglishAudio(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {englishAudio && (
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    Selected: {englishAudio.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="hindi-audio"
                  className="flex items-center gap-2 text-sm sm:text-base"
                >
                  <FileAudio className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  Hindi Audio File *
                </Label>
                <Input
                  id="hindi-audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => sethindiAudio(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {hindiAudio && (
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    Selected: {hindiAudio.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-md" className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  Report (Markdown) *
                </Label>
                <Input
                  id="report-md"
                  type="file"
                  accept=".md,.markdown"
                  onChange={(e) => setReportMd(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {reportMd && (
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    Selected: {reportMd.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this record"
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description"
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm sm:text-base">Theme</Label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm sm:text-base"
                >
                  <option value="Finance Report">Finance Report</option>
                  <option value="Finance Topic">Finance Topic</option>
                  <option value="Financial Literacy">Financial Literacy</option>
                  <option value="Company Info">Company Info</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">Speakers</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setSpeakers((s) => [...s, { title: "", description: "" }])
                    }
                    className="text-xs sm:text-sm"
                  >
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Add Speaker
                  </Button>
                </div>
                <div className="space-y-2">
                  {speakers.map((sp, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <Input
                        className="col-span-12 sm:col-span-4 text-sm"
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
                        className="col-span-12 sm:col-span-7 text-sm"
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
                        className="col-span-12 sm:col-span-1 p-2"
                        onClick={() =>
                          setSpeakers((prev) =>
                            prev.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-pdf" className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                  Report (PDF) - Optional
                </Label>
                <Input
                  id="report-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setReportPdf(e.target.files?.[0] || null)}
                  className="cursor-pointer text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {reportPdf && (
                  <p className="text-xs sm:text-sm text-muted-foreground break-words">
                    Selected: {reportPdf.name}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 shadow-card text-sm sm:text-base"
                size="lg"
              >
                <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Upload Complete</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Record ID: {uploadedInfo.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <p className="mb-2 text-sm sm:text-base">Files uploaded:</p>
                    <ul className="list-disc ml-4 sm:ml-6 space-y-1 text-xs sm:text-sm">
                      {uploadedInfo.english && (
                        <li className="break-words">
                          English:{" "}
                          <a
                            className="text-primary underline"
                            href={uploadedInfo.english.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.english.filename}
                          </a>
                        </li>
                      )}
                      {uploadedInfo.hindi && (
                        <li className="break-words">
                          Hindi:{" "}
                          <a
                            className="text-primary underline"
                            href={uploadedInfo.hindi.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.hindi.filename}
                          </a>
                        </li>
                      )}
                      {uploadedInfo.report_md && (
                        <li className="break-words">
                          MD Report:{" "}
                          <a
                            className="text-primary underline"
                            href={uploadedInfo.report_md.public_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {uploadedInfo.report_md.filename}
                          </a>
                        </li>
                      )}
                      {uploadedInfo.report_pdf && (
                        <li className="break-words">
                          PDF:{" "}
                          <a
                            className="text-primary underline"
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
                      <Button onClick={() => setUploadedInfo(null)} className="w-full sm:w-auto text-sm sm:text-base">
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
