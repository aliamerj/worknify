import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { SiTask } from "react-icons/si";
import { formatDate } from "@/utils/helper_function";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";
import { FaPencilAlt } from "react-icons/fa";
import { useApiCallContext } from "@/utils/context/api_call_context";

import {
  useCurrentProject,
  useRemoveFeature,
  useSetFeatureToUpdate,
} from "../../context/hooks";
import dynamic from "next/dynamic";
const TaskCount = dynamic(() => import("./task_number"), {
  ssr: false,
});

export const FeaturesCard = ({
  onOpen,
  feature,
}: {
  onOpen: () => void;
  feature: FeatureSelection;
}) => {
  const { setMessageRes } = useApiCallContext();
  const setSelectedFeatureToUpdate = useSetFeatureToUpdate();

  const removeFeature = useRemoveFeature();
  const { isOwner } = useCurrentProject();

  return (
    <Card className="group relative flex max-h-44 w-80 items-center rounded-lg bg-background p-2">
      {isOwner && (
        <div className="absolute right-2 top-2 z-50 hover:cursor-pointer">
          <div className="flex flex-col">
            <button
              onClick={async () => {
                try {
                  const res = await axios.delete(ApiRouter.features, {
                    data: {
                      projectId: feature.projectId,
                      featureId: feature.id,
                    },
                  });
                  setMessageRes({
                    isError: false,
                    message: res.data.message,
                  });
                  removeFeature(feature.id);
                } catch (error: any) {
                  setMessageRes({
                    isError: true,
                    message: error.response.data.message,
                  });
                }
              }}
              className="rounded-full border border-transparent bg-transparent p-1 text-danger-500 hover:border-gray-300 hover:text-danger-600"
              aria-label="Delete feature"
            >
              <RiDeleteBin5Line className="text-xl" />
            </button>
            <button
              onClick={() => {
                setSelectedFeatureToUpdate({
                  id: feature.id,
                  projectId: feature.projectId,
                  order: feature.order,
                  featureName: feature.featureName,
                  description: feature.description ?? undefined,
                  tag: feature.tags?.split(";") ?? undefined,
                  includeFeature: feature.includeFeature,
                  timePeriod: {
                    startDate: feature.startDate ?? null,
                    endDate: feature.endDate ?? null,
                  },
                });
                onOpen();
              }}
              className="rounded-full border border-transparent bg-transparent p-1 text-warning-600 hover:border-gray-300 hover:text-warning-500"
              aria-label="Delete feature"
            >
              <FaPencilAlt className="text-xl" />
            </button>
          </div>
        </div>
      )}
      <CardHeader className="flex gap-3">
        <SiTask className="text-lg" />
        <div className="flex flex-col">
          <div className="flex items-center justify-start">
            <p className="text-lg">{feature.featureName}</p>
            <TaskCount featureId={feature.id} />
          </div>
          <p className="text-small text-default-500">
            {feature.startDate && formatDate(feature.startDate)}
            {feature.startDate && " - "}
            {feature.endDate && formatDate(feature.endDate)}
          </p>
          <div className="w-full">
            {feature.tags?.split(";").map((tag, index) => (
              <span
                key={tag + index}
                className="text-gray-80 mr-2 inline-flex items-start justify-start rounded-full bg-primary-200 px-2 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      {feature.description && (
        <>
          <Divider />
          <CardBody>
            <p>{feature.description}</p>
          </CardBody>
        </>
      )}
    </Card>
  );
};
