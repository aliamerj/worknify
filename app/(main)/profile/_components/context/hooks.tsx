import { useContext } from "react";
import {
  FindDifferencesContext,
  LoadingContext,
  ProfileDataContext,
  ProfileIdContext,
  ResetFormContext,
  SetLoadingContext,
} from "./profile_context";

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (context === undefined) {
    throw new Error("useProfileData must be used within a ProfileDataProvider");
  }
  return context;
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a ProfileDataProvider");
  }
  return context;
};

export const useSetLoading = () => {
  const context = useContext(SetLoadingContext);
  if (context === undefined) {
    throw new Error("useSetLoading must be used within a ProfileDataProvider");
  }
  return context;
};

export const useResetForm = () => {
  const context = useContext(ResetFormContext);
  if (context === undefined) {
    throw new Error("useResetForm must be used within a ProfileDataProvider");
  }
  return context;
};

export const useFindDifferences = () => {
  const context = useContext(FindDifferencesContext);
  if (context === undefined) {
    throw new Error(
      "useFindDifferences must be used within a ProfileDataProvider",
    );
  }
  return context;
};
