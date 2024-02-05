"use client";
import { Button, Divider, useDisclosure } from "@nextui-org/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

import { FeaturesCard } from "../feature_card/features_card";
import { AddFeatureModal } from "../add_feature_modal/add_feature_modal";
export type Feature = {
  id: number;
  name: string;
  description: string;
  tag: string;
  startDate: Date;
  endDate: Date;
  tasksCount: number;
};

export const Sidebar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      name: "sending email",
      description:
        "Make beautiful websites regardless of your design experience.",
      tag: "MVP",
      tasksCount: 5,
      startDate: new Date(),
      endDate: new Date(),
    },
    {
      id: 2,
      name: "showing email",
      description:
        "Make beautiful websites regardless of your design experience.",
      tag: "V1",
      tasksCount: 2,
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);
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

  return (
    <aside
      id="default-sidebar"
      className="fixed left-0 top-10 h-screen w-80"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li className="flex items-center justify-between py-4 text-2xl font-bold">
            <h1 className="text-gray-800">App Features</h1>
            <Button
              isIconOnly
              color="primary"
              variant="solid"
              aria-label="add new feature"
              onPress={onOpen}
            >
              <IoMdAdd className="text-2xl text-white" />
            </Button>
            <AddFeatureModal isOpen={isOpen} onOpenChange={onOpenChange} />
          </li>
          <Divider />
          <DragDropContext
            onDragEnd={handleOnDragEnd}
            onDragStart={handleOnDragStart}
          >
            <Droppable droppableId="features">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {features.map((feature, index) => (
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
                          <FeaturesCard feature={feature} />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ul>
      </div>
    </aside>
  );
};
