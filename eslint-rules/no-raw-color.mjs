// Local ESLint rule. Colours are tokens, defined once in src/app/globals.css
// and documented in docs/DESIGN_SYSTEM.md. A literal hex or rgb()/rgba() in a
// .tsx file is a colour nobody can find or change from one place.
const HEX_COLOR = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/;
const RGB_FUNC = /\brgba?\(/i;

function findMatch(text) {
  if (typeof text !== "string") return null;
  const hex = text.match(HEX_COLOR);
  if (hex) return hex[0];
  const rgb = text.match(RGB_FUNC);
  if (rgb) return rgb[0];
  return null;
}

const noRawColorRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw hex colours and rgb()/rgba() in .tsx files. Use a token from docs/DESIGN_SYSTEM.md instead.",
    },
    schema: [],
    messages: {
      rawColor:
        "Raw colour value '{{match}}' is not allowed here. Use a design token from docs/DESIGN_SYSTEM.md / src/app/globals.css instead of a literal colour.",
    },
  },
  create(context) {
    function check(node, text) {
      const match = findMatch(text);
      if (match) {
        context.report({ node, messageId: "rawColor", data: { match } });
      }
    }
    return {
      Literal(node) {
        check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
    };
  },
};

export default noRawColorRule;
