"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created at 16/5/18.
 * @Author Ling.
 * @Email i@zeroling.com
 */

exports.default = function (_ref) {
  var types = _ref.types;
  return {
    visitor: {
      Identifier: function Identifier(path, state) {
        path.node.name = JSON.stringify(state.opts[path.node.name]) || path.node.name;
      }
    }
  };
};

module.exports = exports["default"];