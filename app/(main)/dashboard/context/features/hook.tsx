// hooks/useFeatures.js
import { useCallback, useReducer } from "react";
import { FeatureSelection } from "@/db/schemes/featureSchema";
import { featureReducer } from "./reducer";

export const useFeatures = (initialFeatures: FeatureSelection[]) => {
  const [features, dispatchFeature] = useReducer(
    featureReducer,
    initialFeatures,
  );

  const pushFeature = useCallback((feature: FeatureSelection) => {
    dispatchFeature({ type: "PUSH_FEATURE", payload: feature });
  }, []);

  const removeFeature = useCallback((id: number) => {
    dispatchFeature({ type: "REMOVE_FEATURE", payload: id });
  }, []);

  const updateFeature = useCallback((feature: FeatureSelection) => {
    dispatchFeature({ type: "UPDATE_FEATURE", payload: feature });
  }, []);

  const updateFeatureOrder = useCallback((newFeatures: FeatureSelection[]) => {
    dispatchFeature({ type: "UPDATE_FEATURE_ORDER", payload: newFeatures });
  }, []);

  return {
    features,
    pushFeature,
    removeFeature,
    updateFeature,
    updateFeatureOrder,
  };
};
