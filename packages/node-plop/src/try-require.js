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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _require = jiti(rootDirectory, {
    esmResolve: true,
    interopDefault: true,
  });

  try {
    return _require(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      console.error(
        new Error(`Error trying import ${id} from ${rootDirectory}`, {
          cause: error,
        }),
      );
    }

    console.log(error)

    return errorReturn;
  }
};

export default tryRequire;
