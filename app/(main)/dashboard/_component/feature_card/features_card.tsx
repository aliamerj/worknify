import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { SiTask } from "react-icons/si";

import { formatDate } from "@/utils/helper_function";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FeatureSelection } from "@/db/schemes/featureSchema";

export const FeaturesCard = ({ feature }: { feature: FeatureSelection }) => {
  return (
    <Card className="group relative flex max-h-44 w-80 items-center rounded-lg bg-gray-200 p-2">
      <div className="absolute right-2 top-2 z-50 hover:cursor-pointer">
        <button
          onClick={() => {}}
          className="rounded-full border border-transparent bg-transparent p-1 text-danger-600 hover:border-gray-300 hover:text-danger-700"
          aria-label="Delete feature"
        >
          <RiDeleteBin5Line className="text-xl" />
        </button>
      </div>
      <CardHeader className="flex gap-3">
        <SiTask className="text-lg" />
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <p className="text-lg">{feature.featureName}</p>
            <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-small font-medium text-blue-800">
              0
            </span>
            <span className="text-gray-80 ms-3 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-sm font-medium">
              {feature.tags}
            </span>
          </div>
          <p className="text-small text-default-500">
            {feature.startDate && formatDate(feature.startDate)} -{" "}
            {feature.endDate && formatDate(feature.endDate)}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{feature.description}</p>
      </CardBody>
    </Card>
  );
};