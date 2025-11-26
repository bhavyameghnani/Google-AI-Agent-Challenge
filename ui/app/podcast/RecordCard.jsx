"use client";

import { useRouter } from "next/navigation";
import { FileText, Calendar, Music } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RecordCard = ({ id, title, uploadDate, hasPdf, thumbnail }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/podcast/${id}`);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 cursor-pointer group animate-scale-in"
      onClick={handleNavigate}
    >
      <div className="relative h-40 sm:h-48 bg-gradient-primary overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Music className="h-12 w-12 sm:h-16 sm:w-16 text-primary-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 group-hover:text-accent transition-colors">
            {title}
          </h3>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>{new Date(uploadDate).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            <Music className="h-3 w-3 mr-1" />
            Dual Audio
          </Badge>
          {hasPdf && (
            <Badge variant="secondary" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              PDF Report
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevents card click from triggering navigation twice
            router.push(`/podcast/${id}`);
          }}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm sm:text-base"
          variant="outline"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecordCard;
