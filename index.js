/**
 * Created at 16/5/18.
 * @Author Ling.
 * @Email i@zeroling.com
 */
'use strict'
const babylon = require('babylon')

module.exports = (babel) => {
  const t = babel.types
  // cache for performance
  const parseMap = {}

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
        let replacementDescriptor = state.opts[path.node.name]
        if (replacementDescriptor === undefined || replacementDescriptor === null) {
          replacementDescriptor = t.identifier(String(replacementDescriptor))
        }

        const type = typeof replacementDescriptor
        if (type === 'string' || type === 'boolean') {
          replacementDescriptor = {
            type: type,
            replacement: replacementDescriptor
          }
        } else if (t.isNode(replacementDescriptor)) {
          replacementDescriptor = {
            type: 'node',
            replacement: replacementDescriptor
          }
        } else if (type === 'object'
          && replacementDescriptor.type === 'node'
          && typeof replacementDescriptor.replacement === 'string') {
          replacementDescriptor.replacement = parseMap[replacementDescriptor.replacement]
            ? parseMap[replacementDescriptor.replacement]
            : babylon.parseExpression(replacementDescriptor.replacement)
        }

        const replacement = replacementDescriptor.replacement
        switch (replacementDescriptor.type) {
          case 'boolean':
            path.replaceWith(t.booleanLiteral(replacement))
            break
          case 'node':
            if (t.isNode(replacement)) {
              path.replaceWith(replacement)
            }
            break
          default:
            // treat as string
            const str = String(replacement)
            path.replaceWith(t.stringLiteral(str))
            break
        }
      }
    }
  }
};
