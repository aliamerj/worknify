"use client";
import { Sidebar } from "../left_slider/side_bar";
import { useEffect, useRef, useState } from "react";
import { AiOutlineProject } from "react-icons/ai";
import { Button, Progress, Spinner, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { ReorderFeatureSchema } from "@/utils/validations/featureValidation";
import axios from "axios";
import { ApiRouter, AppRouter } from "@/utils/router/app_router";
import { useRouter } from "next/navigation";
import { EmptyBoardFeature } from "../empty_board_feature/empty_board_feature";
import { FaLightbulb } from "react-icons/fa";
import { BoardFeature } from "../board_feature/board_feature";
import { useApiCallContext } from "@/utils/context/api_call_context";
import { FaPeopleGroup } from "react-icons/fa6";
import { DevsModal } from "../devs_modal/devs_modal";
import { ToastContainer } from "react-toastify";
import {
  useContributorsInfo,
  useFeatureInfo,
  useUpdateFeatureOrder,
} from "../../context/hooks";
import { ProjectQuery } from "../../[projectId]/page";
import dynamic from "next/dynamic";
const CompletionBar = dynamic(() => import("./completion_bar"), {
  ssr: false,
  loading: () => (
    <Progress
      label="Completion Progress"
      aria-label="Completion..."
      size="sm"
      value={0}
      color="primary"
      showValueLabel={true}
      className="max-w-full"
    />
  ),
});
export enum DroppableIds {
  featuresList = "FEATURE_LIST",
  featuresDisplayer = "FEATURE_DISPLAYER",
}

export const TaskMangementPage = ({
  project,
  isOwner,
  featureId,
}: {
  project: ProjectQuery;
  isOwner?: string;
  featureId?: number;
}) => {
  const router = useRouter();
  const features = useFeatureInfo();
  const contributors = useContributorsInfo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setMessageRes, isLoading, setIsLoading } = useApiCallContext();
  const [newFeatureOrder, setNewFeatureOrder] =
    useState<ReorderFeatureSchema>();
  const updateFeatureOrder = useUpdateFeatureOrder();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      if (!isOwner)
        return setMessageRes({
          isError: true,
          message: "Only The Creator of this project can Reorder the features ",
        });
      reorderFeatures(result.source.index, result.destination.index);
      return;
    }
  };

  const reorderFeatures = (sourceIndex: number, destinationIndex: number) => {
    const items = Array.from(features);
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
      projectId: project.id,
      items: updatedFeatures.map(({ id, order }) => ({
        featureId: id,
        order,
      })),
    });
  };

  const handleShowDetailsDrop = (featureId: string) => {
    const query = featureId ? `?feature=${featureId}` : "";
    router.push(AppRouter.dashboardPage + project.id + query);
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

  const feature = features.find((f) => f.id === featureId);

  return (
    <>
      <div className="flex">
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onDragStart={handleOnDragStart}
        >
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            onOpenSidebar={handleToggleSidebar}
            features={features}
          />
          <div
            className={`flex-1 p-5 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-96" : "ml-16"}`}
          >
            <div className="flex items-center space-x-4">
              {project.logo ? (
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              ) : (
                <AiOutlineProject className="text-4xl text-primary" />
              )}
              <div className="flex w-full items-center justify-between">
                <h1 className="text-3xl font-semibold">{project.name}</h1>
                <Button
                  variant="faded"
                  color="primary"
                  size="md"
                  onPress={onOpen}
                  startContent={
                    <FaPeopleGroup className="text-3xl underline" />
                  }
                >
                  {contributors.length}
                </Button>
                <DevsModal onClose={onClose} isOpen={isOpen} />
              </div>
            </div>
            <div className="flex items-center space-x-4 pl-5">
              <FaLightbulb className="text-2xl text-warning" />
              <p className="text-xl text-gray-600">{project.projectGoal}</p>
            </div>
            <div className="py-4">
              <CompletionBar />
            </div>
            <Droppable droppableId={DroppableIds.featuresDisplayer}>
              {(provided, snap) =>
                !feature ? (
                  <EmptyBoardFeature provided={provided} />
                ) : (
                  <BoardFeature
                    provided={provided}
                    isDraggingOver={snap.isDraggingOver}
                    feature={feature}
                  />
                )
              }
            </Droppable>
          </div>
        </DragDropContext>
      </div>
      <ToastContainer position="bottom-left" className="z-50" />
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
