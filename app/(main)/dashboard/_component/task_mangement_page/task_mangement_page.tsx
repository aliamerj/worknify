"use client";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { Sidebar } from "../left_slider/side_bar";
import { useEffect, useRef, useState } from "react";
import {
  AiOutlineArrowLeft,
  AiOutlineBulb,
  AiOutlineProject,
} from "react-icons/ai";
import { Progress, Spinner } from "@nextui-org/react";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { ReorderFeatureSchema } from "@/utils/validations/featureValidation";
import axios from "axios";
import { ApiRouter } from "@/utils/router/app_router";
import { SideErrorMessage } from "@/global-components/side_error_message/side_error_message";
import { MessageRes } from "../../hooks/useMessage";
import { useFeatures } from "../../hooks/useFeatures";

export enum DroppableIds {
  featuresList = "FEATURE_LIST",
  featuresDisplayer = "FEATURE_DISPLAYER",
}

interface ITaskMangementPage {
  features: FeatureSelection[];
  projectId: number;
  isOwner: boolean;
  projectName: string;
  projectGoal: string;
  projectComplation: number;
  projectLogo?: string;
}

export const TaskMangementPage = ({
  features,
  projectId,
  isOwner,
  projectName,
  projectGoal,
  projectComplation,
  projectLogo,
}: ITaskMangementPage) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    features: currentFeatures,
    pushFeature,
    removeFeature,
    updateFeature,
    updateFeatureOrder,
  } = useFeatures(features);
  const [newFeatureOrder, setNewFeatureOrder] =
    useState<ReorderFeatureSchema>();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageRes | null>(null);
  const setMessageRes = (res: MessageRes) => {
    setMessage(res);
    setTimeout(() => setMessage(null), 5000);
  };

  const handleToggleSidebar = () => setIsSidebarOpen((current) => !current);

  const handleOnDragStart = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(100);
  };

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const { droppableId } = result.destination;
    if (droppableId === DroppableIds.featuresDisplayer) {
      handleShowDetailsDrop(result.draggableId);
      return;
    }
    if (
      droppableId === DroppableIds.featuresList &&
      result.destination.index !== result.source.index
    ) {
      reorderFeatures(result.source.index, result.destination.index);
      return;
    }
  };

  const reorderFeatures = (sourceIndex: number, destinationIndex: number) => {
    const items = Array.from(currentFeatures);
    // Remove the item from its current position
    const [reorderedItem] = items.splice(sourceIndex, 1);
    // Insert the item at its new position
    items.splice(destinationIndex, 0, reorderedItem);
    // After reordering, we need to update each feature's order property
    const updatedFeatures = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    // Update the state with the newly ordered features
    updateFeatureOrder(updatedFeatures);
    // Prepare the order data for the backend update
    setNewFeatureOrder({
      projectId: projectId,
      items: updatedFeatures.map(({ id, order }) => ({
        featureId: id,
        order,
      })),
    });
  };

  const handleShowDetailsDrop = (featureId: string) => {
    console.log(`Show details for feature ${featureId}`);
  };

  const isInitialMount = useRef(true);
  useEffect(() => {
    async function updates() {
      setIsLoading(true);
      try {
        const res = await axios.patch(
          ApiRouter.reorderFeatures,
          newFeatureOrder,
        );
        setMessageRes({ isError: false, message: res.data.message });
      } catch (error: any) {
        setMessageRes({
          isError: true,
          message: error.response.data.message,
        });
      }
      setIsLoading(false);
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (newFeatureOrder) {
        updates();
      }
    }
  }, [newFeatureOrder, setNewFeatureOrder]);

  return (
    <>
      <div className="flex">
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onDragStart={handleOnDragStart}
        >
          <Sidebar
            currentFeatures={currentFeatures}
            projectId={projectId}
            isOwner={isOwner}
            isSidebarOpen={isSidebarOpen}
            onOpenSidebar={handleToggleSidebar}
            pushNewFeature={pushFeature}
            removeFeature={removeFeature}
            updateFeature={updateFeature}
            setMessageRes={setMessageRes}
          />
          <div
            className={`flex-1 p-5 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-96" : "ml-16"}`}
          >
            <div className="flex items-center space-x-4">
              {projectLogo ? (
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={projectLogo}
                    alt={`${projectName} logo`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <AiOutlineProject className="text-4xl text-primary" />
              )}
              <h1 className="text-3xl font-semibold">{projectName}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <AiOutlineBulb className="text-2xl text-warning" />
              <p className="text-xl text-gray-600">{projectGoal}</p>
            </div>
            <div className="py-4">
              <Progress
                label="Completion Progress"
                aria-label="Completion..."
                size="sm"
                value={projectComplation}
                color="primary"
                showValueLabel={true}
                className="max-w-full"
              />
            </div>
            <Droppable droppableId={DroppableIds.featuresDisplayer}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-10"
                  style={{
                    height: "calc(100vh - 260px)",
                  }}
                >
                  <div className="flex items-center justify-center space-x-2 text-lg text-gray-600">
                    <AiOutlineArrowLeft className="text-xl font-bold text-primary" />
                    <p>Drop feature card to explore the dashboard</p>
                  </div>

                  <p className="text-sm text-gray-500">
                    Discover detailed insights and more...
                  </p>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
      {message && (
        <SideErrorMessage
          errorMessage={message.message}
          isError={message.isError}
        />
      )}
      {isLoading && (
        <Spinner
          size="lg"
          color="warning"
          className="fixed bottom-5 left-5 z-50"
        />
      )}
    </>
  );
};
