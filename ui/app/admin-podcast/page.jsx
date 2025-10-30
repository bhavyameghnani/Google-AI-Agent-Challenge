"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, FileAudio, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Navbar } from "../dashboard/CompanyDashboard";
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
    setRecords(records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
    setEditingRecord(null);
  };

  const handleDelete = async (id) => {
    setDeletingInProgress(true);
    try {
      const res = await fetch(`http://localhost:8000/records/${id}`, {
        method: "DELETE",
        });

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
      const res = await fetch("http://localhost:8000/records");
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
    
          {/* Fixed Navbar */}
          <div className="fixed top-0 left-0 w-full z-20 bg-white/70 backdrop-blur-md shadow-sm">
            <Navbar />
          </div>
          
    <section className="container mx-auto px-4 py-16 bg-gradient-subtle" id="dashboard">
      <div className="max-w-7xl mx-auto">
         <div className="text-center mb-12 animate-fade-in">
            <br/>
          <h2 className="text-3xl font-bold mb-4">Generate Podcast & Newsletter</h2>
        </div>
           <div>
              <GeneratePodcast/>
            </div>
        <div className="text-center mb-12 animate-fade-in">
            <br/>
          <h2 className="text-3xl font-bold mb-4">Records Dashboard</h2>
          <p className="text-muted-foreground">
            View, edit, and manage all your uploaded files
          </p>
        </div>

        <Card className="shadow-elevated animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Uploaded Files</CardTitle>
                <CardDescription>
                  {records.length} record{records.length !== 1 ? 's' : ''} in total
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {loading ? (
                  <span className="text-sm text-muted-foreground">Loading...</span>
                ) : (
                  <Button size="sm" onClick={() => fetchRecords()}>Refresh</Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>English Audio</TableHead>
                    <TableHead>hindi Audio</TableHead>
                    <TableHead>MD Report</TableHead>
                    <TableHead>PDF Report</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record, index) => (
                    <TableRow 
                      key={record.id} 
                      className="hover:bg-muted/50 transition-colors animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <TableCell className="font-medium">#{record.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileAudio className="h-4 w-4 text-primary" />
                          <span className="text-sm truncate max-w-[150px]" title={record.englishAudio}>
                            {record.englishAudio}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileAudio className="h-4 w-4 text-primary" />
                          <span className="text-sm truncate max-w-[150px]" title={record.hindiAudio}>
                            {record.hindiAudio}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-accent" />
                          <span className="text-sm truncate max-w-[150px]" title={record.reportMd}>
                            {record.reportMd}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.reportPdf ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="text-sm truncate max-w-[150px]" title={record.reportPdf}>
                              {record.reportPdf}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(record.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="hover:bg-primary hover:text-primary-foreground transition-colors"
                            disabled={deletingInProgress}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingId(record.id)}
                            className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            disabled={deletingInProgress}
                          >
                            {deletingInProgress && deletingId === record.id ? (
                              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
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
        <UploadSection/>
      </div>
      <br/>

      

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