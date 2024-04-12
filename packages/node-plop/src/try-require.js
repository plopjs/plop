import jiti from "jiti";

/**
 * Try to require a module, if it fails, return the errorReturn value
 *
 * @param {string} id - The module id to require
 * @param {string} rootDirectory - The root directory to require the module from
 * @param {any} errorReturn - The value to return if the require fails
 *
 * @returns {any} The required module or the errorReturn value
 */
const tryRequire = (id, rootDirectory, errorReturn) => {
  const _require = jiti(rootDirectory, {
    esmResolve: true,
    interopDefault: true,
  });

  return _require(id);
};

export default tryRequire;
