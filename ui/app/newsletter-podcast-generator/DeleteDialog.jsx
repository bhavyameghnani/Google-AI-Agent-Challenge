import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeleteDialog = ({ onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onCancel();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onCancel}>
      <AlertDialogContent className="w-[95vw] sm:w-full max-w-md p-4 sm:p-6">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            <AlertDialogTitle className="text-base sm:text-lg">Delete Record</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Are you sure you want to delete this record? This action cannot be undone and will 
            permanently remove all associated files.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
          >
            {loading ? (
              <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;