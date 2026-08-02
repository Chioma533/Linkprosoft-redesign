import { getDashboardRoute } from "./getDashboardRoute";

export const validateEmail = (email) =>  {
   const reqex = /^[^\s@]+@[^\s@]+\.[^\s#]+$/;
    return reqex.test(email)
}

export const redirectWithPreloader = (role) => {
    const dashboard = getDashboardRoute(role)

    showPreloader(() => {
        navigate(dashboard, {replace: true})
    })
}