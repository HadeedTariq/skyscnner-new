import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface SearchButtonProps {
  isLoading: boolean;
  className?: string;
  aria_label: string;
}

export const SearchButton = ({
  isLoading,
  className = "bg-light-blue text-white w-full py-8 rounded-2xl hover:bg-light-blue/90 transition-colors flex items-center justify-center gap-2",
  aria_label,
}: SearchButtonProps) => (
  <Button
    type="submit"
    className={className}
    variant="default"
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Searching...
      </>
    ) : (
      <>
        <Search className="h-5 w-5" />
        <span>{aria_label}</span>
      </>
    )}
  </Button>
);
