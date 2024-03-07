import { FeatureSchema } from "@/utils/validations/featureValidation";
import { TaskSchema } from "@/utils/validations/taskValidation";
import { useCallback, useState } from "react";

export const useUpdateEntities = () => {
  const [featureToUpdate, setFeatureToUpdate] = useState<
    FeatureSchema | undefined
  >();
  const [taskToUpdate, setTaskToUpdate] = useState<TaskSchema | undefined>();

  const setSelectedTaskToUpdate = useCallback((task?: TaskSchema) => {
    setTaskToUpdate(task);
  }, []);

  const setSelectedFeatureToUpdate = useCallback((feature?: FeatureSchema) => {
    setFeatureToUpdate(feature);
  }, []);

  return {
    featureToUpdate,
    setFeatureToUpdate: setSelectedFeatureToUpdate,
    taskToUpdate,
    setTaskToUpdate: setSelectedTaskToUpdate,
  };
};
