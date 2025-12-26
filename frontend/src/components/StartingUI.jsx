import { Heart } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function StartingUI() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1">
      <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-md mb-6">
        <Heart size={40} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Manas+</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 max-w-3xl">
        <FeatureCard emoji="😷" title="Physical Health" desc="Symptoms & injuries" />
        <FeatureCard emoji="🧠" title="Mental Wellness" desc="Stress & sleep care" />
        <FeatureCard emoji="💊" title="Guidance & Care" desc="Medicines & advice" />
      </div>
    </div>
  );
}
