import { formatDate } from "@/utils/helper_function";
import { FaRocket, FaCalendarAlt, FaSadTear } from "react-icons/fa";
export interface FeatureData {
  id: number;
  featureName: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}
function ProjectFeatures({ features }: { features: FeatureData[] }) {
  if (features.length === 0) {
    return (
      <div className="text-center">
        <FaSadTear className="mx-auto text-6xl text-primary" />
        <h3 className="mt-2 text-xl font-semibold">No Features Found</h3>
        <p className="text-gray-600">
          It seems like no main features have been defined yet.
        </p>
      </div>
    );
  }

  return (
    <section className="p-4 md:p-8">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.length > 0 ? (
          features.map((feature) => (
            <Feature key={feature.id} feature={feature} />
          ))
        ) : (
          <p className="text-center text-gray-600">No features available.</p>
        )}
      </div>
    </section>
  );
}

function Feature({ feature }: { feature: FeatureData }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-center space-x-4 p-6">
        <FaRocket className="shrink-0 text-2xl text-primary" />
        <div>
          <h3 className="text-xl font-semibold">{feature.featureName}</h3>
          <p className="text-gray-600">
            {feature.description || "No description provided"}
          </p>
        </div>
      </div>
      <div className="mt-auto bg-gray-100 p-4">
        <div className="flex items-center text-gray-700">
          <FaCalendarAlt />
          <span className="ml-2">
            {feature.startDate && feature.endDate
              ? `${formatDate(feature.startDate)} -> ${formatDate(feature.endDate)}`
              : "No date range provided"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProjectFeatures;
