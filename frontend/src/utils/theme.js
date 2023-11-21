import { cyan, orange, red } from "@mui/material/colors";
import {
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

// Create a theme instance.
export let theme = extendTheme({
  GoPaperless: {
    headerHeight: "55px",
    footerBarHeight: "66px",
    appBarHeight: "48px",
    containerMaxWidth: "1920px",
  },
  typography: {
    fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
    h6: {
      fontSize: 14, // Adjust the font size as needed
    },
    h5: {
      fontSize: 13, // Adjust the font size as needed
    },
    h4: {
      fontSize: 12, // Adjust the font size as needed
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#26293F",
        },
        secondary: {
          light: "#EDF7FA",
          main: "#00A8CC",
        },
        // grey 200
        signingBackground: {
          main: "#eeeeee",
        },
        //white
        signingWFBackground: {
          main: "#FFF",
        },
        //lightBlue 50
        dialogBackground: {
          main: "#e1f5fe",
        },
        // grey 300
        borderColor: {
          light: "#DFDBD6",
          main: "#e0e0e0",
        },
        // gray
        signingtext1: {
          light: "#1C1C1C",
          main: "#1C1C1C",
        },
        //lighter
        signingtext2: {
          light: "#6B7280",
          main: "#6B7280",
        },
        signingtextBlue: {
          light: "#3B82F6",
          main: "#3B82F6",
        },
        error: {
          main: red.A400,
        },
        text: {
          primary: "#21243D",
        },
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
      },
    },
  },
  // palette: {
  //   mode: "light",
  //   primary: {
  //     main: "#26293F",
  //   },
  //   secondary: {
  //     light: "#EDF7FA",
  //     main: "#00A8CC",
  //   },
  //   // grey
  //   signingBackground: {
  //     light: "#E8EBF0",
  //     main: "#E8EBF0",
  //   },
  //   //white
  //   signingSubBackground: {
  //     light: "#FFF",
  //     main: "#FFF",
  //   },
  //   dialogBackground: {
  //     light: "#F3FBFF",
  //     main: "#F3FBFF",
  //   },
  //   // light grey
  //   borderColor: {
  //     light: "#DFDBD6",
  //     main: "#DFDBD6",
  //   },
  //   // gray
  //   signingtext1: {
  //     light: "#1C1C1C",
  //     main: "#1C1C1C",
  //   },
  //   //lighter
  //   signingtext2: {
  //     light: "#6B7280",
  //     main: "#6B7280",
  //   },
  //   signingtextBlue: {
  //     light: "#3B82F6",
  //     main: "#3B82F6",
  //   },
  //   error: {
  //     main: red.A400,
  //   },
  //   text: {
  //     primary: "#21243D",
  //   },
  // },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "md",
      },
      styleOverrides: {
        maxWidthSm: {
          maxWidth: "680px",

          "@media (min-width: 600px)": {
            maxWidth: "680px",
          },
        },
        maxWidthMd: {
          maxWidth: "860px",

          "@media (min-width: 900px)": {
            maxWidth: "860px",
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
      styleOverrides: {
        root: {
          color: "black",

          "&:hover, &.active": {
            color: "#FF6464",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // background: '#df0f0f', // set cho tất cả MuiButton
          // color: 'white',
          textTransform: "capitalize",
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            color: "white",
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {
        root: {
          paddingInline: 2, // set cho tất cả MuiChip
        },
      },
      variants: [
        {
          props: { color: "secondary" },
          style: {
            color: "white",
            backgroundColor: "#142850", // chỉ set cho MuiChip có prop secondary
            fontSize: 16,
            fontWeight: "bold",
          },
        },
      ],
    },
    MuiToolbar: {
      styleOverrides: {
        dense: {
          height: 48,
          minHeight: 48,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

// theme.typography.h3 = {
// 	fontSize: '2rem',

// 	[theme.breakpoints.up('md')]: {
// 		fontSize: '3rem',
// 	},
// }
