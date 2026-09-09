import { renton } from "@renton/eslint-config";

export default renton({
  stylistic: {
    quotes: "double",
    semi: true,
  },
  jsonc: true,
  yaml: true,
  markdown: false,
}, {
  rules: {
    "antfu/no-top-level-await": "off",
    "jsdoc/check-tag-names": "off",
    "regexp/optimal-quantifier-concatenation": "off",
    "unicorn/no-computed-property-existence-check": "off",
  },
});
