import { BuildTheme } from "../../assets/global/Theme-variable";
import {OPTIONS_THEME} from "../../assets/global/constants";

const ThemeSettings = () => {
    const INIT_STATE = {
        activeDir: "ltr",
        activeNavbarBg: "#0b70fb",
        activeSidebarBg: "#ffffff",
        activeMode: "light",
        activeTheme: OPTIONS_THEME,
        SidebarWidth: 240
    };

    const customizer = INIT_STATE;

    const theme = BuildTheme({
        direction: customizer.activeDir,
        theme: customizer.activeTheme
    });

    document.dir = customizer.activeDir;

    return theme;
};

export default ThemeSettings;