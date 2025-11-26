"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_BASE = process.env.NEXT_PUBLIC_RECORDS_API;

const RecordDetail = ({ id }) => {
  console.log("Received ID:", id);

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/records/${id}`);
        if (!res.ok) throw new Error("Failed to fetch record");
        const data = await res.json();
        setRecord(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) return <div className="text-center p-4 sm:p-6 text-sm sm:text-base">Loading...</div>;

  if (error || !record)
    return (
      <div className="text-center p-4 sm:p-6 text-red-500 text-sm sm:text-base">
        {error || "Record not found"}
      </div>
    );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Record Header */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs sm:text-sm">Record #{record.id}</Badge>
          <Badge variant="secondary" className="text-xs sm:text-sm">
            {new Date(record.created_at || "").toLocaleDateString()}
          </Badge>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-words">{record.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground break-words">{record.description}</p>
      </div>

      {/* Audio Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <AudioPlayer
          title="English Version"
          language="English"
          audioFile={
            record.english?.public_url ||
            `${API_BASE}/records/${record.id}/stream/english`
          }
        />
        <AudioPlayer
          title="Hindi Version"
          language="Hindi"
          audioFile={
            record.hindi?.public_url ||
            `${API_BASE}/records/${record.id}/stream/hindi`
          }
        />
      </div>

      {/* Reports Section */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Available Reports</CardTitle>
          <CardDescription className="text-sm">
            View or download reports for this record
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4">
          {record.report_pdf && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-muted rounded-lg gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base break-words">{record.report_pdf.filename}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">PDF Report</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* View PDF */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full sm:w-auto text-sm">View</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh] overflow-auto p-3 sm:p-6">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg break-words">{record.report_pdf.filename}</DialogTitle>
                      <DialogDescription className="text-sm">
                        Preview of the PDF report
                      </DialogDescription>
                    </DialogHeader>
                    <iframe
                      src={`${API_BASE}/records/${record.id}/stream/report_pdf`}
                      className="w-full h-[60vh] sm:h-[80vh] border rounded"
                    />
                  </DialogContent>
                </Dialog>

                {/* Download PDF */}
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-sm">
                  <a
                    href={
                      record.report_pdf.public_url ||
                      `${API_BASE}/records/${record.id}/stream/report_pdf`
                    }
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordDetail;
