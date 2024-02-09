"use client";
import {
  Button,
  Divider,
  ScrollShadow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { FeaturesCard } from "../feature_card/features_card";
import { AddFeatureModal } from "../add_feature_modal/add_feature_modal";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { SideErrorMessage } from "@/global-components/side_error_message/side_error_message";
export type MessageRes = {
  isError: boolean;
  message: string;
};
export const Sidebar = ({
  isOwner,
  projectId,
  currentFeatures,
}: {
  projectId: number;
    isOwner:boolean;
  currentFeatures: FeatureSelection[];
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [features, setFeatures] = useState<FeatureSelection[]>(currentFeatures);
  const [message, setMessage] = useState<MessageRes | null>(null);
  const pushNewFeature = (feature: FeatureSelection) =>
    setFeatures((current) => [...current, feature]);
  const removeFeature = (id: number) =>
    setFeatures((current) => current.filter((f) => f.id !== id));
  const handleOnDragStart = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(100);
  };
  const handleOnDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;
    const items = Array.from(features);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFeatures(items);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setMessageRes = (res: MessageRes) => {
    setMessage(res);

    setTimeout(() => setMessage(null), 5000);
  };
  const sidebarClasses = isSidebarOpen ? "w-96" : "w-16";
  const contentClasses = isSidebarOpen ? "opacity-100" : "opacity-0";
  return (
    <>
      <div
        className={`fixed left-0 top-0 z-40 h-screen bg-gray-800 transition-all duration-300 ease-in-out ${sidebarClasses}`}
      >
        <div className="relative flex h-full">
          <div
            className={`flex w-96 flex-col items-center  py-4 transition-opacity duration-500 ease-in-out ${contentClasses}`}
          >
            <div className="flex w-full items-center justify-evenly py-4 text-2xl font-bold">
              <h1 className="text-white">App Features</h1>
<Tooltip placement="right-end" color="warning" content={isOwner ? "Click To add new feaure": "Only the owner of this project can add new feature"}>
              <div >
              <Button
                isIconOnly 
                isDisabled={!isOwner}
                disableAnimation={!isOwner}
                color={"success"}
                variant="solid"
                className={isOwner ? "bg-gray-800": ""}
                aria-label="add new feature"
                onPress={onOpen}
              >
                <IoMdAdd className="text-2xl text-white" />
              </Button>

              </div>
                          </Tooltip>
            </div>
            <Divider className="bg-white text-white" />
            <div className="flex w-full flex-col items-center py-4">
              {features.length === 0 && (
                <div className="pt-10 text-center">
                  <p className="mb-2 text-lg font-medium text-white">
                    No features added yet.
                  </p>
                  <p className="text-sm text-gray-300">
                    Get started by adding a new feature!
                  </p>
                </div>
              )}
              <ul className="space-y-2 font-medium">
                <DragDropContext
                  onDragEnd={handleOnDragEnd}
                  onDragStart={handleOnDragStart}
                >
                  <Droppable droppableId="features">
                    {(provided) => (
                      <ScrollShadow
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          direction: "rtl",
                          maxHeight: "calc(100vh - 100px)",
                          overflowY: "auto",
                        }}
                      >
                        <div style={{ direction: "ltr", padding: "0 10px" }}>
                          {features
                            .sort((a, b) => a.order - b.order)
                            .map((feature, index) => (
                              <Draggable
                                key={feature.id}
                                draggableId={feature.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    className="py-2"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <FeaturesCard
                                      feature={feature}
                                      isOwner={isOwner}
                                      setMessageRes={(res) =>
                                        setMessageRes(res)
                                      }
                                      removeFeature={removeFeature}
                                    />
                                  </li>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      </ScrollShadow>
                    )}
                  </Droppable>
                </DragDropContext>
              </ul>
            </div>
          </div>
          <button
            onClick={handleToggleSidebar}
            className="absolute right-0 top-1/2 -mr-6 -translate-y-1/2 transform rounded-r-full bg-gray-800 p-2 text-white"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <MdOutlineNavigateBefore className="text-xl" />
            ) : (
              <MdOutlineNavigateNext className="text-xl" />
            )}
          </button>
        </div>
      </div>
      <AddFeatureModal
        isOpen={isOpen}
        projectId={projectId}
        onOpenChange={onOpenChange}
        currentFeatures={currentFeatures}
        pushNewFeature={pushNewFeature}
        setMessageRes={(res) => setMessageRes(res)}
      />
      {message && (
        <SideErrorMessage
          errorMessage={message.message}
          isError={message.isError}
        />
      )}
    </>
  );
};
