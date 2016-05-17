'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created at 16/5/15.
 * @Author Ling.
 * @Email i@zeroling.com
 */

function matchImages(sourceName) {
  "use strict";

  var fileExt = sourceName.match(/\.(jpe?g|tiff?|png|svg|gif|webp)$/);
  return (fileExt || [, null])[1];
}

exports.default = function (_ref) {
  var types = _ref.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        // path.node.specifiers
        var source = path.node.source;
        if (source && source['type'] === 'StringLiteral' && matchImages(source['value'])) {
          var id = source;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = path.node.specifiers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var specifier = _step.value;

              if (specifier.type === 'ImportDefaultSpecifier') {
                id = specifier.local.name;
                break;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          path.replaceWith(types.variableDeclaration('const', [types.variableDeclarator(types.identifier(id), types.identifier('require(\'fs\').readFileSync(require(\'path\').join(__dirname, \'' + source.value + '\')'))]));
        }
      },
      CallExpression: function CallExpression(path) {
        var src = path.node.arguments[0] && path.node.arguments[0]['value'];
        if (src && matchImages(src)) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'require') {
            // require()
            path.replaceWith(types.identifier('require(\'fs\').readFileSync(require(\'path\').join(__dirname, \'' + src + '\')'));
          } else if (path.node.callee.type === 'MemberExpression' && path.node.callee.property.name === 'ensure') {
            // todo require.ensure()
          }
        }
      }
    }
  };
};

module.exports = exports['default'];