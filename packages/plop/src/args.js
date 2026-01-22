import { parseArgs } from "node:util";

export const args = process.argv.slice(2);

const { values, positionals } = parseArgs({
  args,
  options: {
    // bin/plop.js options
    cwd: { type: "string" },
    preload: { type: "string", multiple: true },
    plopfile: { type: "string" },
    completion: { type: "string" },
    // src/plop.js options
    progress: { type: "boolean" },
    dest: { type: "string" },
    force: { type: "boolean", short: "f" },
    "show-type-names": { type: "boolean", short: "t" },
    // src/input-processing.js options
    help: { type: "boolean", short: "h" },
    init: { type: "boolean", short: "i" },
    "init-ts": { type: "boolean" },
    version: { type: "boolean", short: "v" },
  },
  strict: false,
  allowPositionals: true,
});

// Provide minimist-compatible interface for gradual migration
// Only include aliases when they have values (minimist doesn't include undefined keys)
export const argv = {
  _: positionals,
  ...values,
  // Aliases for compatibility - only add if truthy to match minimist behavior
  ...(values.help && { h: values.help }),
  ...(values.init && { i: values.init }),
  ...(values.version && { v: values.version }),
  ...(values.force && { f: values.force }),
  ...(values["show-type-names"] && { t: values["show-type-names"] }),
};

export { values, positionals };

/**
 * Parse arguments after a given index (used for args after --)
 * Returns a minimist-compatible object with _ for positionals
 *
 * Uses tokens to emulate minimist behavior where `--flag value` treats
 * value as a string argument to the flag (not a positional)
 */
export function parseArgsAfter(startIndex) {
  const slicedArgs = args.slice(startIndex);
  const { tokens } = parseArgs({
    args: slicedArgs,
    strict: false,
    allowPositionals: true,
    tokens: true,
  });

  const result = { _: [] };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.kind === "option") {
      // Check if this boolean option is followed by a positional (minimist-style string value)
      // For unknown options with strict:false, value is undefined (no = sign) or a string (--opt=val)
      const nextToken = tokens[i + 1];
      const isBooleanFlag = token.value === undefined;
      if (
        isBooleanFlag &&
        nextToken?.kind === "positional" &&
        !nextToken.value.startsWith("-")
      ) {
        // Treat the next positional as this option's value (minimist behavior)
        result[token.name] = nextToken.value;
        i++; // Skip the next token
      } else {
        // Use value if present, otherwise default to true for flags
        result[token.name] = token.value ?? true;
      }
    } else if (token.kind === "positional") {
      result._.push(token.value);
    }
  }

  return result;
}
