export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui"],
        plusjakarta: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 16px 50px rgba(0, 0, 0, 0.35)",
      },
      colors: {
        surface: "#111111",
        border: "#222222",
        primaryText: "#f4f4f5",
        mutedText: "#71717a",
        success: "#22c55e",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
