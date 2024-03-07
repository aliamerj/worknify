import {
  Button,
  Divider,
  ScrollShadow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import { IoMdAdd } from "react-icons/io";

import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { FeaturesCard } from "../feature_card/features_card";
import { AddFeatureModal } from "../add_feature_modal/add_feature_modal";

import { DroppableIds } from "../task_mangement_page/task_mangement_page";
import { useCurrentProject, useSetFeatureToUpdate } from "../../context/hooks";
import { FeatureSelection } from "@/db/schemes/featureSchema";

export const Sidebar = ({
  isSidebarOpen,
  onOpenSidebar,
  features,
}: {
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
  features: FeatureSelection[];
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOwner } = useCurrentProject();
  const setSelectedFeatureToUpdate = useSetFeatureToUpdate();

  const sidebarClasses = isSidebarOpen
    ? "w-96 opacity-100"
    : "w-16 opacity-100";
  const contentTransitionClasses =
    "transition-opacity duration-300 ease-in-out";
  const contentVisibilityClasses = isSidebarOpen
    ? "opacity-100 visible"
    : "opacity-0 invisible";
  const contentDelayClasses = isSidebarOpen ? "delay-300" : "delay-0";
  return (
    <div
      className={`fixed left-0 top-0 z-40 h-screen bg-gray-800 transition-all duration-300 ease-in-out ${sidebarClasses}`}
    >
      <div className="relative flex h-full">
        <div
          className={`flex w-96 flex-col items-center py-4 ${contentTransitionClasses} ${contentVisibilityClasses} ${contentDelayClasses}`}
        >
          <div className="flex w-full items-center justify-evenly py-4 text-2xl font-bold text-white">
            <h1 className="text-white">App Features</h1>
            <Tooltip
              placement="right-end"
              color="warning"
              content={
                isOwner
                  ? "Click To add new feaure"
                  : "Only the owner of this project can add new feature"
              }
            >
              <div>
                <Button
                  isIconOnly
                  isDisabled={!isOwner}
                  color="success"
                  variant="solid"
                  aria-label="add new feature"
                  onPress={(_) => {
                    setSelectedFeatureToUpdate(undefined);
                    onOpen();
                  }}
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
              <Droppable droppableId={DroppableIds.featuresList}>
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
                                draggable="true"
                                className="py-2"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <FeaturesCard
                                  onOpen={onOpen}
                                  feature={feature}
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
            </ul>
          </div>
        </div>
        <button
          onClick={onOpenSidebar}
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

      <AddFeatureModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
