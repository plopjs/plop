const execa = require("execa");
const { resolve } = require("path");

module.exports = {
  /**
   * @param {Array} args
   * @param {Object} opts
   * @returns {execa.ExecaChildProcess | *}
   */
  runInstrumentedPlop(args = [], opts = {}) {
    const { cwd = __dirname } = opts;

    const exec = execa(
      "npx",
      [
        "nyc",
        "--silent",
        "node",
        resolve(__dirname, "../instrumented/bin/plop.js"),
        ...args,
      ],
      {
        cwd,
      }
    );

    const stdoutArr = [];

    let localResolve = null;
    /**
     * Made an array so if, for some reason, we have more than a single
     * awaited promise on data waiting, this will call all of them, rather
     * than accidentally hanging
     *
     * @type {{promise: Promise, resolve: () => void}[]}
     */
    let dataWaitPromises = [];
    const additionalExecProps = {
      // Clear buffer of stdout to do more accurate `t.regex` checks
      clear() {
        this.stdoutArr = [];
      },
      // An array of strings gathered from stdout when unable to do
      // `await stdout` because of inquirer interactive prompts
      stdoutArr,
      // Because we can't always do `await stdout` (interactive prompts)
      // We needed some way to say "wait until Node has ran" before checking.
      // `stdout`. This is a loose solution to check if node has output anything
      waitForNode: new Promise((resolve) => (localResolve = resolve)),
      // Run this to check when new console output is sent. Useful
      // when checking if a `stdin.write` has changed the `stdout` values
      //
      // If maxTime is hit, assume data has passed properly
      waitForData: (maxTime = 500) => {
        let localDataResolve = null;
        const promise = new Promise((resolve) => (localDataResolve = resolve));
        dataWaitPromises.push({ promise, resolve: localDataResolve });
        setTimeout(() => {
          console.warn(
            `
\`waitForData\`'s \`maxTime\` has been hit.

If you're seeing this, it's likely because you manually \`syncWait\`'d after a \`stdin.write\`.

Remove the manual \`syncWait\` and replace with a \`waitForData\` call only
          `.trim()
          );

          if (promise.pending) localDataResolve();
        }, maxTime);
        return promise;
      },
    };

    exec.stdout.on("data", (result) => {
      stdoutArr.push(result.toString());
      if (localResolve) localResolve();
      if (dataWaitPromises.length) {
        setTimeout(() => {
          dataWaitPromises.forEach((prom) => prom.resolve());
          dataWaitPromises = [];
          /**
           * Add tiny timeout so if more than one line is logged
           * at a time, it won't only display the newest log
           *
           * FWIW, this may not be an issue due to micro-queue, but
           * I'd rather not test that. 10MS is negligible in terms of
           * test times
           */
        }, 10);
      }
    });

    Object.assign(exec, additionalExecProps);

    return exec;
  },
  DOWN: "\x1B\x5B\x42",
  UP: "\x1B\x5B\x41",
  ENTER: "\x0D",
  syncWait: (time = 200) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    }),
  // `Array.__proto__.at` is only in Node 16. Remove when that's a
  // more reasonable dev target
  at: (arr, n) => {
    n = Math.trunc(n) || 0;
    if (n < 0) n += arr.length;
    if (n < 0 || n >= arr.length) return undefined;
    return arr[n];
  },
};
