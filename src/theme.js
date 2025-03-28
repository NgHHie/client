// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // blue
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
};
export const tokensDark2 = {
  grey: {
    0: "#e0e0e0",
    10: "#b3b3b3",
    50: "#8c8c8c",
    100: "#666666",
    200: "#4d4d4d",
    300: "#333333",
    400: "#1a1a1a",
    500: "#0d0d0d",
    600: "#050505",
    700: "#000000",
    800: "#000000",
    900: "#000000",
    1000: "#000000",
  },
  primary: {
    // xanh lam
    100: "#a6b1c1",
    200: "#8a9bb2",
    300: "#5e6e8d",
    400: "#2e4460",
    500: "#0d2235",
    600: "#0a1d2f",
    700: "#07141f",
    800: "#040d13",
    900: "#02070a",
  },
  secondary: {
    // đỏ
    50: "#f8d7da",
    100: "#f1b0b7",
    200: "#e89a9e",
    300: "#e08385",
    400: "#d7666a",
    500: "#d23d3a",
    600: "#b7312e",
    700: "#9d2523",
    800: "#821a17",
    900: "#660f0f",
  },
  xanhduong: {
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
  },

  vang: {
    // vang
    50: "#f0f0f0",
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
};

function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            xanhduong: {
              ...tokensDark2.xanhduong,
            },
            vang: {
              ...tokensDark2.vang,
            },
            primary: {
              ...tokensDark2.primary,
              main: tokensDark2.primary[400],
              light: tokensDark2.primary[300],
            },
            secondary: {
              ...tokensDark2.secondary,
              main: tokensDark2.secondary[300],
            },
            neutral: {
              ...tokensDark2.grey,
              main: tokensDark2.grey[400],
            },
            background: {
              default: tokensDark2.primary[500],
              alt: tokensDark2.primary[400],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 14,
      },
      h7: {
        fontFamily: ["Montserrat", "sans-serif"].join(","),
        fontSize: 10,
      },
    },
  };
};
