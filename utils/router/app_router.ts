export const AppRouter = {
  home: "/",
  signup: "/api/auth/signin",
  // profile
  createProfile: "/profile/create",
  editProfile: "/profile/update",
  viewProfile: "/profile/view/",
  //project
  createProject: "/project/create",
  editPrject: "/project/update/",
  viewProject: "/project/view/",
  myProject: "/project/my",
};
export const ApiRouter = {
  signin: "/api/auth/signin",
  signOut: "/api/auth/signout",
  profileStar: "/api/profile/star/",
  projectStar: "/api/project/star/",
  projectJoin: "/api/project/join/",
};
