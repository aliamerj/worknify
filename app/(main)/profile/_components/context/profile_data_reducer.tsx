import { ProfileData } from "./profile_context";

type ProfileAction =
  | { type: "UPDATE_PROFILE_DATA"; newData: Partial<ProfileData> }
  | { type: "RESET_FORM"; defaultProfileData: ProfileData };

type ProfileState = ProfileData;

export const profileDataReducer = (
  state: ProfileState,
  action: ProfileAction,
): ProfileState => {
  switch (action.type) {
    case "UPDATE_PROFILE_DATA":
      return { ...state, ...action.newData };
    case "RESET_FORM":
      return { ...action.defaultProfileData };
    default:
      return state;
  }
};
