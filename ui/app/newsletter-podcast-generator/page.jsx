"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, FileAudio, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EditModal from "./EditModal";
import DeleteDialog from "./DeleteDialog";
import { Navbar } from "@/components/Navbar";
import UploadSection from "./UploadSection";
import GeneratePodcast from "./GeneratePodcast";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);

  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const handleSaveEdit = (updatedRecord) => {
    setRecords(
      records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    );
    setEditingRecord(null);
  };

  const handleDelete = async (id) => {
    setDeletingInProgress(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RECORDS_API}/records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e?.message || "Failed to delete");
      throw e;
    } finally {
      setDeletingInProgress(false);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RECORDS_API}/records`);
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      const mapped = data.map((d) => ({
        id: d.id,
        englishAudio: d.english?.filename || "",
        hindiAudio: d.hindi?.filename || "",
        reportMd: d.report_md?.filename || "",
        reportPdf: d.report_pdf?.filename || undefined,
        uploadDate: d.created_at || new Date().toISOString(),
      }));
      setRecords(mapped);
    } catch (e) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar forceSolid={true} />

      <section
        className="container mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16 bg-gradient-subtle pt-20"
        id="dashboard"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Generate Podcast & Newsletter
            </h2>
          </div>
          <div>
            <GeneratePodcast />
          </div>
          <div className="text-center mb-8 sm:mb-12 animate-fade-in mt-8 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Records Dashboard
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              View, edit, and manage all your uploaded files
            </p>
          </div>

          <Card className="shadow-elevated animate-scale-in">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Uploaded Files
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {records.length} record{records.length !== 1 ? "s" : ""} in
                    total
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {loading ? (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Loading...
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => fetchRecords()}
                      className="w-full sm:w-auto text-sm"
                    >
                      Refresh
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs sm:text-sm">ID</TableHead>
                      <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                        English Audio
                      </TableHead>
                      <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                        Hindi Audio
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                        MD Report
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                        PDF Report
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm">
                        Upload Date
                      </TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record, index) => (
                      <TableRow
                        key={record.id}
                        className="hover:bg-muted/50 transition-colors animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TableCell className="font-medium text-xs sm:text-sm">
                          #{record.id}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <FileAudio className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                            <span
                              className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]"
                              title={record.englishAudio}
                            >
                              {record.englishAudio}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <FileAudio className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                            <span
                              className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]"
                              title={record.hindiAudio}
                            >
                              {record.hindiAudio}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                            <span
                              className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]"
                              title={record.reportMd}
                            >
                              {record.reportMd}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {record.reportPdf ? (
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-accent flex-shrink-0" />
                              <span
                                className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[150px]"
                                title={record.reportPdf}
                              >
                                {record.reportPdf}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              N/A
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(record.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="hover:bg-primary hover:text-primary-foreground transition-colors p-1.5 sm:p-2"
                              disabled={deletingInProgress}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingId(record.id)}
                              className="hover:bg-destructive hover:text-destructive-foreground transition-colors p-1.5 sm:p-2"
                              disabled={deletingInProgress}
                            >
                              {deletingInProgress &&
                              deletingId === record.id ? (
                                <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <UploadSection />
        </div>
        <br />

        {editingRecord && (
          <EditModal
            record={editingRecord}
            onSave={handleSaveEdit}
            onCancel={() => setEditingRecord(null)}
          />
        )}

        {deletingId && (
          <DeleteDialog
            onConfirm={() => handleDelete(deletingId)}
            onCancel={() => setDeletingId(null)}
          />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
