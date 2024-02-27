export const AppRouter = {
  home: "/",
  signup: "/api/auth/signin",
  notification: "/notifications",
  // profile
  createProfile: "/profile/create",
  editProfile: "/profile/update",
  viewProfile: "/profile/view/",
  //project
  createProject: "/project/create",
  editProject: "/project/update/",
  viewProject: "/project/view/",
  myProject: "/project/owner/",
  // dashboard
  dashboardPage: "/dashboard/",
  //utilties
  about: "/about",
  service: "/services",
  privacyPolicy: "/privacy_policy",
  contact: "/contact",
};
export const ApiRouter = {
  signin: "/api/auth/signin",
  signOut: "/api/auth/signout",
  profileStar: "/api/profile/star/",
  projectStar: "/api/project/star/",
  projectJoin: "/api/project/join/",
  notifications: "/api/notifications/",
  features: "/api/feature",
  reorderFeatures: "/api/feature/reorder",
  tasks: "/api/task",
  reorderTasks: "/api/task/reorder",
  profile: "/api/profile",
};
