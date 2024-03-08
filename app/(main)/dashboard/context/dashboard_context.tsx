"use client";
import _ from "lodash";
import React, { useMemo } from "react";
import * as Contexts from "./dashboardContextDefinitions";
import { useProjectValue } from "./ProjectValues/hook";
import { useFeatures } from "./features/hook";
import { useTasks } from "./tasks/hook";
import { useContributors } from "./contributors/hook";
import { useUpdateEntities } from "./updateEntities/hook";
import { ProjectQuery } from "../[projectId]/page";

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
  project: ProjectQuery;
  isOwner?: string;
  isDev?: string;
}> = ({ children, project: initialData, isDev, isOwner }) => {
  const {
    project,
    features: initialFeatures,
    tasks: initialTasks,
    devs,
  } = useProjectValue(initialData);
  const projectValue = useMemo(
    () => ({
      project,
      isOwner,
      isDev,
    }),
    [project.id],
  );
  const {
    features,
    pushFeature,
    removeFeature,
    updateFeature,
    updateFeatureOrder,
  } = useFeatures(initialFeatures);
  const { tasks, pushTask, removeTask, updateTask, updateTaskOrder } =
    useTasks(initialTasks);
  const { contributors, removeContributor } = useContributors(
    project.creator,
    devs,
  );
  const { featureToUpdate, setFeatureToUpdate, taskToUpdate, setTaskToUpdate } =
    useUpdateEntities();

  return (
    <Contexts.ProjectInfoContext.Provider value={projectValue}>
      <Contexts.RemoveContributorContext.Provider value={removeContributor}>
        <Contexts.PushFeatureContext.Provider value={pushFeature}>
          <Contexts.PushTaskContext.Provider value={pushTask}>
            <Contexts.RemoveFeatureContext.Provider value={removeFeature}>
              <Contexts.RemoveTaskContext.Provider value={removeTask}>
                <Contexts.UpdateFeatureContext.Provider value={updateFeature}>
                  <Contexts.SetFeatureToUpdateContext.Provider
                    value={setFeatureToUpdate}
                  >
                    {" "}
                    <Contexts.UpdateTaskContext.Provider value={updateTask}>
                      <Contexts.SetTasksToUpdateContext.Provider
                        value={setTaskToUpdate}
                      >
                        <Contexts.ReorderFeatureContext.Provider
                          value={updateFeatureOrder}
                        >
                          <Contexts.ReorderTaskContext.Provider
                            value={updateTaskOrder}
                          >
                            <Contexts.ContributorContext.Provider
                              value={contributors}
                            >
                              <Contexts.FeatureInfoContext.Provider
                                value={features}
                              >
                                <Contexts.FeatureToUpdateContext.Provider
                                  value={featureToUpdate}
                                >
                                  <Contexts.TaskInfoContext.Provider
                                    value={tasks}
                                  >
                                    <Contexts.TaskToUpdateContext.Provider
                                      value={taskToUpdate}
                                    >
                                      {children}
                                    </Contexts.TaskToUpdateContext.Provider>
                                  </Contexts.TaskInfoContext.Provider>
                                </Contexts.FeatureToUpdateContext.Provider>
                              </Contexts.FeatureInfoContext.Provider>
                            </Contexts.ContributorContext.Provider>
                          </Contexts.ReorderTaskContext.Provider>
                        </Contexts.ReorderFeatureContext.Provider>
                      </Contexts.SetTasksToUpdateContext.Provider>
                    </Contexts.UpdateTaskContext.Provider>
                  </Contexts.SetFeatureToUpdateContext.Provider>
                </Contexts.UpdateFeatureContext.Provider>
              </Contexts.RemoveTaskContext.Provider>
            </Contexts.RemoveFeatureContext.Provider>
          </Contexts.PushTaskContext.Provider>
        </Contexts.PushFeatureContext.Provider>
      </Contexts.RemoveContributorContext.Provider>
    </Contexts.ProjectInfoContext.Provider>
  );
};
