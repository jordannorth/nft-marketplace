module.exports = {
  //Didn't have this included beforehand, not sure how his works without it
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "duck-logo": "url('/img/duck-logo.png')",
      },
    },
  },
  plugins: [],
};
