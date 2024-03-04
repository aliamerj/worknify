import { FeatureSelection } from "@/db/schemes/featureSchema";

type FeatureAction =
  | { type: "PUSH_FEATURE"; payload: FeatureSelection }
  | { type: "REMOVE_FEATURE"; payload: number }
  | { type: "UPDATE_FEATURE"; payload: FeatureSelection }
  | { type: "UPDATE_FEATURE_ORDER"; payload: FeatureSelection[] };

export const featureReducer = (
  state: FeatureSelection[],
  action: FeatureAction,
): FeatureSelection[] => {
  switch (action.type) {
    case "PUSH_FEATURE":
      return [...state, action.payload];
    case "REMOVE_FEATURE":
      return state.filter((feature) => feature.id !== action.payload);
    case "UPDATE_FEATURE":
      return state.map((feature) =>
        feature.id === action.payload.id
          ? { ...feature, ...action.payload }
          : feature,
      );
    case "UPDATE_FEATURE_ORDER":
      return action.payload;
    default:
      return state;
  }
};
