import { RouteObject } from "react-router"
import OptionsDashboard from "../pages/options-dashboard/OptionsDashboard"

const Router: RouteObject[] = [
    {
        path: "/",
        element: <OptionsDashboard />,
    },

]

export default Router