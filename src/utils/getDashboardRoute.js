export const getDashboardRoute = (role) => {
  switch (role) {
    case "professional":
      return "/professional/home";

    case "employer":
      return "/home";

    case "admin":
      return "/admin/dashboard";

    default:
      return "/";
  }
};

export const redirectToDashboard = (role, navigate, options = {}) => {
  const dashboardRoute = getDashboardRoute(role);
  navigate(dashboardRoute, options);
};