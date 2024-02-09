import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { SiTask } from "react-icons/si";

import { formatDate } from "@/utils/helper_function";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";
import { MessageRes } from "../left_slider/side_bar";
import { useSession } from "next-auth/react";


export const FeaturesCard = ({
  feature,
  removeFeature,
  setMessageRes,
  isOwner,
}: {
  feature: FeatureSelection;
    isOwner:boolean
  setMessageRes: (res: MessageRes) => void;
  removeFeature: (id: number) => void;
}) => {
  return (
    <>
      <Card className="group relative flex max-h-44 w-80 items-center rounded-lg bg-background p-2">
        {isOwner &&  <div className="absolute right-2 top-2 z-50 hover:cursor-pointer">
          <button
            onClick={async () => {
              try {
                const res = await axios.delete(ApiRouter.features, {
                  data: {
                    projectId: feature.projectId,
                    featureId: feature.id,
                  },
                });
                setMessageRes({ isError: false, message: res.data.message });
                removeFeature(feature.id);
              } catch (error: any) {
                setMessageRes({
                  isError: true,
                  message: error.response.data.message,
                });
              }
            }}
            className="rounded-full border border-transparent bg-transparent p-1 text-danger-600 hover:border-gray-300 hover:text-danger-700"
            aria-label="Delete feature"
          >
            <RiDeleteBin5Line className="text-xl" />
          </button>
        </div>}
        <CardHeader className="flex gap-3">
          <SiTask className="text-lg" />
          <div className="flex flex-col">
            <div className="flex items-center justify-start">
              <p className="text-lg">{feature.featureName}</p>
              <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-small font-medium text-blue-800">
                0
              </span>
            </div>
            <p className="text-small text-default-500">
              {feature.startDate && formatDate(feature.startDate)}
              {feature.startDate && " - "}
              {feature.endDate && formatDate(feature.endDate)}
            </p>
            <div className="w-full">
              {feature.tags
                ?.split(";")
                .map((tag) => (
                  <span className="text-gray-80 mr-2 inline-flex items-start justify-start rounded-full bg-primary-200 px-2 text-sm font-medium">
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
    </>
  );
};
