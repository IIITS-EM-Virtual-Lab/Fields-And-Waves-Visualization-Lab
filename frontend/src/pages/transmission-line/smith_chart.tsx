import SmithChartCalculator from "@/components/SmithChartCalculator.tsx"
import "katex/dist/katex.min.css";

const SmithChart = () => {

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">

      {/* Page Title */}
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-10 tracking-wide">
        Smith Chart
      </div>

      {/* Interactive Demo Section */}
      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center">
          <SmithChartCalculator />
        </div>
      </div>
    </div>
  );
};

export default SmithChart;
