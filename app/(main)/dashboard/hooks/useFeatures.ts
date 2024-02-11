import { FeatureSelection } from "@/db/schemes/featureSchema";
import { useState, useCallback } from "react";

export const useFeatures = (initialFeatures: FeatureSelection[]) => {
  const [features, setFeatures] = useState<FeatureSelection[]>(initialFeatures);

  const pushFeature = useCallback((feature: FeatureSelection) => {
    setFeatures((current) => [...current, feature]);
  }, []);

  const removeFeature = useCallback((id: number) => {
    setFeatures((current) => current.filter((f) => f.id !== id));
  }, []);

  const updateFeature = useCallback((updatedFeature: FeatureSelection) => {
    setFeatures((current) =>
      current.map((f) => (f.id === updatedFeature.id ? updatedFeature : f)),
    );
  }, []);
  const updateFeatureOrder = useCallback(
    (newFeatures: FeatureSelection[]) => setFeatures(newFeatures),
    [],
  );

  return {
    features,
    pushFeature,
    removeFeature,
    updateFeature,
    updateFeatureOrder,
  };
};
