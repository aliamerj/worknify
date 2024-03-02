import { ProfileData } from "./profile_context";

type ProfileAction = { type: "RESET_FORM"; defaultProfileData: ProfileData };

type ProfileState = ProfileData;

export const profileDataReducer = (
  state: ProfileState,
  action: ProfileAction,
): ProfileState => {
  switch (action.type) {
    case "RESET_FORM":
      return { ...action.defaultProfileData };
    default:
      return state;
  }
};
