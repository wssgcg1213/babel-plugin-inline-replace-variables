'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created at 16/5/18.
 * @Author Ling.
 * @Email i@zeroling.com
 */

exports.default = function (_ref) {
  var t = _ref.types;
  return {
    visitor: {
      Identifier: function Identifier(path, state) {
        var replacement = state.opts[path.node.name];
        if (path.parent.type === 'MemberExpression') {
          return;
        }
        if (replacement !== undefined) {
          var type = typeof replacement === 'undefined' ? 'undefined' : _typeof(replacement);
          if (type === 'boolean') {
            path.replaceWith(t.booleanLiteral(replacement));
          } else {
            // treat as string
            var str = String(replacement);
            path.replaceWith(t.stringLiteral(str));
          }
        }
      }
    }
  };
};

module.exports = exports['default'];