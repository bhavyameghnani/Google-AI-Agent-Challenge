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

const API_BASE = "http://localhost:8000";

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

  if (loading) return <div className="text-center p-6">Loading...</div>;

  if (error || !record)
    return (
      <div className="text-center p-6 text-red-500">
        {error || "Record not found"}
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Record Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Record #{record.id}</Badge>
          <Badge variant="secondary">
            {new Date(record.created_at || "").toLocaleDateString()}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{record.title}</h1>
        <p className="text-muted-foreground">{record.description}</p>
      </div>

      {/* Audio Section */}
      <div className="grid md:grid-cols-2 gap-6">
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
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            View or download reports for this record
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {record.report_pdf && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">{record.report_pdf.filename}</p>
                  <p className="text-sm text-muted-foreground">PDF Report</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                {/* View PDF */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">View</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>{record.report_pdf.filename}</DialogTitle>
                      <DialogDescription>
                        Preview of the PDF report
                      </DialogDescription>
                    </DialogHeader>
                    <iframe
                      src={`${API_BASE}/records/${record.id}/stream/report_pdf`}
                      className="w-full h-[80vh] border rounded"
                    />
                  </DialogContent>
                </Dialog>

                {/* Download PDF */}
                <Button variant="outline" size="sm" asChild>
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
