"use client";

import { useParams } from "next/navigation";
import RecordDetail from "./RecordDetail";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PodcastDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <RecordDetail id={id} />
    </div>
  );
}
