import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

function LanguageDropDown() {
  const [language, setLanguage] = useState("");
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const saveLanguage = () => {
    i18n.changeLanguage(language);
    console.log(language);

    toast.success("Language Selected Successfully");
    setOpen(false);
  };

  useEffect(() => {
    if (i18n.language) {
      setLanguage(i18n.language);
    } else {
      setLanguage("en-US");
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost" className="cursor-pointer text-black-600">
            <Languages className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black-600">
              Language Settings
            </DialogTitle>
            <DialogDescription className="text-black-600">
              Choose your preferred language. Changes will apply across the
              site.
            </DialogDescription>
          </DialogHeader>
          <Select onValueChange={setLanguage} defaultValue={language}>
            <SelectTrigger className="w-full border-black-600 text-black-600">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="es-ES">Español (ES)</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-black-600 text-black-600 hover:bg-black-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 cursor-pointer hover:bg-blue-500 transition duration-300  text-white "
              onClick={() => saveLanguage()}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default LanguageDropDown;
