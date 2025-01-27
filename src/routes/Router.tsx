import { RouteObject } from "react-router"
import OptionsDashboard from "../pages/options-dashboard/OptionsDashboard"
import { LayoutV6AppAnalytics } from "../layouts/mui-treasury/layout-v6-app-analytics"

const Router: RouteObject[] = [
    {
        path: "/",
        element: <OptionsDashboard />,
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