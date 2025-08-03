import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
    ) : (
      <>
        <Search className="h-5 w-5" />
        <span>{aria_label}</span>
      </>
    )}
  </Button>
);
