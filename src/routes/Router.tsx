import { RouteObject } from "react-router"
import OptionsDashboard from "../pages/options-dashboard/OptionsDashboard"
import { LayoutV6AppAnalytics } from "../layouts/mui-treasury/layout-v6-app-analytics"
import Login from "../pages/login /Login"

const Router: RouteObject[] = [
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/v2",
        element: <LayoutV6AppAnalytics />,
        children: [{
            index: true,
            element: <OptionsDashboard />
        }]

    }

]

export default Router