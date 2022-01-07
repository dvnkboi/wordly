module.exports = {
  extends: ["prettier", "plugin:vue/vue3-recommended"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
