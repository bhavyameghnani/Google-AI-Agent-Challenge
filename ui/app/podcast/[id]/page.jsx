"use client";

import { useParams } from "next/navigation";
import RecordDetail from "./RecordDetail";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export default function PodcastDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar forceSolid={true} />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pt-20">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <RecordDetail id={id} />
      </div>
    </div>
  );
}
