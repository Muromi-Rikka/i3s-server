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
    "antfu/no-top-level-await": "off",
    "jsdoc/check-tag-names": "off",
    "regexp/optimal-quantifier-concatenation": "off",
    "unicorn/no-computed-property-existence-check": "off",
  },
});
