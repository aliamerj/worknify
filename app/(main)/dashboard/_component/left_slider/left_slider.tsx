"use client";
import { formatDate } from "@/utils/helper_function";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { SiTask } from "react-icons/si";
import { IoHeartCircleOutline } from "react-icons/io5";
type Feature = {
  id: number;
  name: string;
  description: string;
  tag: string;
  startDate: Date;
  endDate: Date;
  tasksCount: number;
};

export const LeftSlider = () => {
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
      className="fixed left-0 top-0 z-40 h-screen w-80"
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
              aria-label="Take a photo"
            >
              <IoMdAdd className="text-2xl text-white" />
            </Button>
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
                          <Card className="group flex max-w-[400px] items-center rounded-lg bg-gray-200 p-2">
                            <CardHeader className="flex gap-3">
                              <SiTask className="text-lg" />
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                  <p className="text-lg">{feature.name}</p>
                                  <span className="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-small font-medium text-blue-800">
                                    {feature.tasksCount}
                                  </span>

                                  <span className="text-gray-80 ms-3 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-sm font-medium">
                                    {feature.tag}
                                  </span>
              <Button
                isIconOnly
                className="text-default-900/60 data-[hover]:bg-foreground/10 -translate-y-2 translate-x-2"
                radius="full"
                variant="light"

              >
                <IoHeartCircleOutline
                  className={true ? "[&>path]:stroke-transparent" : ""}
                  fill={true ? "currentColor" : "none"}
                />
              </Button>
                                </div>
                                <p className="text-small text-default-500">
                                  {formatDate(feature.startDate.toISOString())}{" "}
                                  - {formatDate(feature.endDate.toISOString())}
                                </p>
                              </div>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                              <p>{feature.description}</p>
                            </CardBody>
                          </Card>
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
