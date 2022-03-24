const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      width: {
        "1/2-gap-4": "calc(50% - 0.5rem)",
        "1/3-gap-4": "calc(33% - 0.5rem)",
        "1/4-gap-4": "calc(25% - 0.5rem)",
      }
    }
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes:
      ["light", "dark"],
  }
};

module.exports = config;
