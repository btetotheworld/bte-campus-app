// Local ESLint rule. The `style` prop bypasses the design system entirely,
// so it is disallowed unless a comment on the same line (or the line
// immediately above) explains why it is necessary.
const noStylePropRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow the style prop unless a comment on the line explains why.",
    },
    schema: [],
    messages: {
      noStyle:
        "The style prop is not allowed here without a comment on this line explaining why. Use Tailwind classes from the design system instead.",
    },
  },
  create(context) {
    const sourceCode =
      typeof context.sourceCode !== "undefined"
        ? context.sourceCode
        : context.getSourceCode();

    return {
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "style") {
          return;
        }
        const line = node.loc.start.line;
        const comments = sourceCode.getAllComments();
        const hasExplanation = comments.some(
          (c) => c.loc.start.line === line || c.loc.start.line === line - 1
        );
        if (!hasExplanation) {
          context.report({ node, messageId: "noStyle" });
        }
      },
    };
  },
};

export default noStylePropRule;
