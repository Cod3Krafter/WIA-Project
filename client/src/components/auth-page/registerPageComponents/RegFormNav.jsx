import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const RegFormNav = ({
  onNext,
  onPrevious,
  isNextDisabled = false,
  nextLabel = "Next",
  prevLabel = "Back"
}) => {
  return (
   <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-8">
  {/* Back Button */}
  <Button
    type="button"
    variant="outline"
    onClick={onPrevious}
    className="flex-1 h-13 border-2 text-lg text-black border-gray-200 hover:border-gray-300 rounded-xl font-semibold"
  >
    <ArrowLeft className="h-5 w-5 mr-2" />
    {prevLabel}
  </Button>

  {/* Next / Continue Button */}
  <Button
    type="button"
    onClick={onNext}
    disabled={isNextDisabled}
    className={`flex-1 h-13 text-lg font-semibold rounded-xl transition-all duration-200 transform shadow-lg
      ${!isNextDisabled
        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-[1.02] hover:shadow-xl"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
  >
    {nextLabel}
    <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
</div>

  );
};

export default RegFormNav;
