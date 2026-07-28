
export const getDashboardRoute = (role) => {
    switch (role) {
        case "professional":
            return "/professional/dashboard";

        case "employer":
            return "/employer/dashboard";

        case "admin":
            return "/admin/dashboard";

        default:
            return "/";
    }
};