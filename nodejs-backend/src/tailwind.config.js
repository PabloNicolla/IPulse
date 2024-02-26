/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./views/**/*.ejs", "./public/**/*.html", "./public/**/*.js"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },

  plugins: [require("daisyui")],
};

/*
daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#be00ff",
          secondary: "#ddb900",
          accent: "#00b300",
          neutral: "#302016",
          "base-100": "#2c1d36",
          info: "#0081e5",
          success: "#00ae77",
          warning: "#ffba00",
          error: "#d5004b",
        },
      },
    ],
  },
*/
