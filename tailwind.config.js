module.exports = {
  mode: "jit",

  content: ["./src/**/*.{html,ts}"],

  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },

    extend: {
      colors: {
        "brand-blue": "#1fb6ff",
        "brand-gray": "#273444",
        "brand-light": "#f4f7fa",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },

  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
