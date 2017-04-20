/**
 * Created at 16/5/18.
 * @Author Ling.
 * @Email i@zeroling.com
 */

module.exports = (babel) => {
  const t = babel.types;
  return {
    visitor: {
      Identifier(path, state) {
        if (path.parent.type === 'MemberExpression') {
          return;
        }
        if (path.parent.type === 'ClassMethod') {
          return;
        }
        if (path.isPure()) {
          return;
        }
        if (!state.opts.hasOwnProperty(path.node.name)) {
          return;
        }
        const replacement = state.opts[path.node.name]
        if (replacement !== undefined) {
          const type = typeof replacement
          if (type === 'boolean') {
            path.replaceWith(t.booleanLiteral(replacement))
          } else if (type === 'object' && t.isNode(replacement)) {
            path.replaceWith(replacement);
          } else { // treat as string
            const str = String(replacement)
            path.replaceWith(t.stringLiteral(str))
          }
        }
      }
    }
  }
};
