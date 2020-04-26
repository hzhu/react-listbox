module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-knobs/register",
    "@storybook/addon-storysource",
    "@storybook/preset-typescript",
    "@storybook/addon-docs/preset",
  ],
};
