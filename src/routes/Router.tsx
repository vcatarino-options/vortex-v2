import { RouteObject } from "react-router"

import { LayoutV6AppAnalytics } from "../layouts/mui-treasury/layout-v6-app-analytics"
import Login from "../pages/login/Login"
import AuthGuard from "../components/access-control/auth-guard/AuthGuard"
import Financial from "./loaders/financial/Financial"
import Loadable from "../layouts/loadable/Loadable"
import { lazy } from "react"

const OptionsDashboard = Loadable(lazy(() => import("../pages/options-dashboard/OptionsDashboard")))

const Router: RouteObject[] = [
    {
        path: "/",
        element: <Login />,
    },
    {
        element: <AuthGuard />,
        children: [
            {
                path: "/dashboard",
                element: <LayoutV6AppAnalytics />,
                children: [{
                    index: true,
                    id: "optionsDashboard",
                    loader: () => Financial.getSelic(),
                    element: <OptionsDashboard />
                }]
            }
        ]
    }

]

export default Router