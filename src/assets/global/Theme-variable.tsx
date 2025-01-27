import { createTheme } from "@mui/material/styles";
import typography from "./Typography";
import components from "./Override";
import shadows from "./Shadows";
import {merge} from "lodash";

import { OPTIONS_THEME } from "./constants";

const SidebarWidth = 265;
const TopbarHeight = 70;

const baseTheme = {
    direction: "ltr",
    link_color: "rgb(3, 201, 215)",
    palette: {
        primary: {
            main: "#1a97f5",
            light: "#e6f4ff",
            dark: "#1682d4"
        },
        secondary: {
            main: "#1e4db7",
            light: "#ddebff",
            dark: "#173f98"
        },

        success: {
            main: "#00c292",
            light: "#ebfaf2",
            dark: "#00964b",
            contrastText: "#ffffff"
        },
        danger: {
            main: "#e46a76",
            light: "#fdf3f5"
        },
        info: {
            main: "#0bb2fb",
            light: "#a7e3f4"
        },
        error: {
            main: "#e46a76",
            light: "#fdf3f5",
            dark: "#e45a68"
        },
        warning: {
            main: "#fec90f",
            light: "#fff4e5",
            dark: "#dcb014",
            contrastText: "#333333"
        },
        text: {
            secondary: "#777e89",
            danger: "#fc4b6c"
        },
        grey: {
            A100: "#ecf0f2",
            A200: "#99abb4",
            A400: "#767e89",
            A700: "#e6f4ff"
        },
        action: {
            disabledBackground: "rgba(73,82,88,0.12)",
            hoverOpacity: 0.02,
            hover: "rgba(0, 0, 0, 0.03)"
        }
    },

    shape: {
        borderRadius: 5
    },
    mixins: {
        toolbar: {
            color: "#949db2",
            "@media(min-width:1280px)": {
                minHeight: TopbarHeight,
                padding: "0 30px"
            },
            "@media(max-width:1280px)": {
                minHeight: "64px"
            }
        }
    },
    status: {
        danger: "#e53e3e"
    },
    components,
    typography,
    shadows
};

const themesOptions: any[] = [
    {
        name: OPTIONS_THEME,
        palette: {
            primary: {
                main: "#37776C",
                light: "#50C878",
                dark: "#355E3b",
                contrastText: "#ffffff"
            },
            secondary: {
                main: "#E5E5E5",
                light: "#3C5547",
                dark: "#070906",
                contrastText: "#ffffff"
            },
        }
    },
];

export const BuildTheme = (config: any = {}) => {
    let themeOptions = themesOptions.find((theme: any) => theme.name === config.theme);
    const customizer = {
        activeDir: "ltr",
        activeNavbarBg: "#0b70fb", // This can be any color,
        activeSidebarBg: "#ffffff", // This can be any color
        activeMode: "dark", // This can be light or dark
        activeTheme: OPTIONS_THEME,
        SidebarWidth: 240
    };
    // console.log("CUSTOMIZER: ", customizer)
    // console.log("MODE: ", customizer.activeMode)
    console.log("TRUE::: ", customizer.activeMode === "dark")
    const baseMode = {
        palette: {
            mode: customizer.activeMode,
            background: {
                default:
                    customizer.activeMode === "dark" ? "#20232a" : "#fafbfb",
                dark: customizer.activeMode === "dark" ? "#1c2025" : "#ffffff",
                paper: customizer.activeMode === "dark" ? "#282C34" : "#ffffff"
            },
            text: {
                primary:
                    customizer.activeMode === "dark"
                        ? "#e6e5e8"
                        : "rgba(0, 0, 0, 0.87)",
                secondary:
                    customizer.activeMode === "dark" ? "#adb0bb" : "#777e89"
            }
        }
    };

    if (!themeOptions) {
        console.warn(new Error(`The theme ${config.theme} is not valid`));
        [themeOptions] = themesOptions;
    }


    const theme: any = createTheme(merge({}, baseTheme, baseMode, themeOptions, { direction: config.direction }))
    console.log("Theme: ", theme)
    return theme;
};

export { TopbarHeight, SidebarWidth, baseTheme };
