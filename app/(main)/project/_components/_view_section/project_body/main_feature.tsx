import { formatDate } from "@/utils/helper_function";
import {
  FaRocket,
  FaCalendarAlt,
  FaSadTear,
  FaArrowRight,
} from "react-icons/fa";
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
      <div className="px-4 py-10 text-center sm:py-16">
        <FaSadTear className="mx-auto text-6xl text-primary" />
        <h3 className="mt-4 text-2xl font-semibold">No Features Found</h3>
        <p className="mx-auto mt-2 max-w-md text-gray-600">
          It seems like no main features have been defined yet.
        </p>
      </div>
    );
  }

  return (
    <section className="p-4 md:p-8">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.length > 0 ? (
          features.map((feature) => (
            <Feature key={feature.id} feature={feature} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No features available.
          </p>
        )}
      </div>
    </section>
  );
}

function Feature({ feature }: { feature: FeatureData }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow transition-shadow duration-300 hover:shadow-xl">
      <div className="flex p-6">
        <div className="shrink-0">
          <FaRocket className="text-3xl text-primary" />
        </div>
        <div className="ml-4 flex flex-grow flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold">{feature.featureName}</h3>
            <p className="mt-1 text-gray-600">
              {feature.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-auto bg-gray-100 p-4">
        <div className="flex items-center text-gray-700">
          <FaCalendarAlt />
          <span className="ml-2 text-sm">
            {feature.startDate && feature.endDate ? (
              <div className="flex items-center">
                {formatDate(feature.startDate)}
                <FaArrowRight className="mx-2" />
                {formatDate(feature.endDate)}
              </div>
            ) : (
              "No date range provided"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProjectFeatures;
