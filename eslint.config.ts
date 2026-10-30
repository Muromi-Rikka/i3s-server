import { renton } from "@renton/eslint-config";

export default renton({
  jsonc: true,
  markdown: false,
  stylistic: {
    quotes: "double",
    semi: true,
  },
  yaml: true,
}, {
  rules: {
    "antfu/no-top-level-await": "off", // src/index.ts:19 Elysia 启动必须 top-level await
  },
});
