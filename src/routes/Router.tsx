import { RouteObject } from "react-router"
import OptionsDashboard from "../pages/options-dashboard/OptionsDashboard"
import { LayoutV6AppAnalytics } from "../layouts/mui-treasury/layout-v6-app-analytics"
import Login from "../pages/login/Login"
import AuthGuard from "../components/access-control/auth-guard/AuthGuard"
import Financial from "./loaders/financial/Financial"

const Router: RouteObject[] = [
    {
        path: "/",
        element: <Login />,
    },
    {
        element: <AuthGuard />,
        children: [
            {
                path: "/v2",
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