/**
 * Created at 16/5/18.
 * @Author Ling.
 * @Email i@zeroling.com
 */

export default ({types}) => ({
  visitor: {
    Identifier (path, state) {
      path.node.name = JSON.stringify(state.opts[path.node.name]) || path.node.name
    }
  }
});
