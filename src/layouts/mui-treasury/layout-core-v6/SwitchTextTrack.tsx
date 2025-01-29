import { styled } from "@mui/material/styles";
import Switch, { switchClasses } from "@mui/material/Switch";

const SwitchTextTrack = styled(Switch)({
  width: 100,
  height: 48,
  padding: 8,
  [`& .${switchClasses.switchBase}`]: {
    padding: 11,
    color: "#ff6a00",
  },
  [`& .${switchClasses.thumb}`]: {
    width: 26,
    height: 26,
    backgroundColor: "#355E3b",
  },
  [`& .${switchClasses.track}`]: {
    background: "#43cea2",
    // background: "#f55d5d",
    opacity: "1 !important",
    borderRadius: 20,
    position: "relative",
    "&:before, &:after": {
      display: "inline-block",
      position: "absolute",
      top: "50%",
      width: "50%",
      transform: "translateY(-50%)",
      color: "#fff",
      textAlign: "center",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    "&:before": {
      content: '"Venda"',
      left: 10,
      opacity: 0,
    },
    "&:after": {
      content: '"Compra"',
      right: 10,
    },
  },
  [`& .${switchClasses.checked}`]: {
    [`&.${switchClasses.switchBase}`]: {
      color: "#111",
      transform: "translateX(52px)",
      "&:hover": {
        backgroundColor: (theme) => theme.palette.primary.dark,
      },
    },
    [`& .${switchClasses.thumb}`]: {
      backgroundColor: "#e01212",
    },
    [`& + .${switchClasses.track}`]: {
      background: "#f55d5d",
      // background: "#43cea2",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
  },
});

export default SwitchTextTrack
