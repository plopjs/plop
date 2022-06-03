/* ========================================================================
 * PROMPT BYPASSING
 * -----------------
 * this allows a user to bypass a prompt by supplying input before
 * the prompts are run. we handle input differently depending on the
 * type of prompt that's in play (ie "y" means "true" for a confirm prompt)
 * ======================================================================== */

/////
// HELPER FUNCTIONS
//

// pull the "value" out of a choice option
const getChoiceValue = (choice) => {
  const isObject = typeof choice === "object";
  if (isObject && choice.value != null) {
    return choice.value;
  }
  if (isObject && choice.name != null) {
    return choice.name;
  }
  if (isObject && choice.key != null) {
    return choice.key;
  }
  return choice;
};

// check if the choice value matches the bypass value
function checkChoiceValue(choiceValue, value) {
  return (
    typeof choiceValue === "string" &&
    choiceValue.toLowerCase() === value.toLowerCase()
  );
}

// check if a bypass value matches some aspect of
// a particular choice option (index, value, key, etc)
function choiceMatchesValue(choice, choiceIdx, value) {
  return (
    checkChoiceValue(choice, value) ||
    checkChoiceValue(choice.value, value) ||
    checkChoiceValue(choice.key, value) ||
    checkChoiceValue(choice.name, value) ||
    checkChoiceValue(choiceIdx.toString(), value)
  );
}

// check if a value matches a particular set of flagged input options
const isFlag = (list, v) => list.includes(v.toLowerCase());
// input values that represent different types of responses
const flag = {
  isTrue: (v) => isFlag(["yes", "y", "true", "t"], v),
  isFalse: (v) => isFlag(["no", "n", "false", "f"], v),
  isPrompt: (v) => /^_+$/.test(v),
};

// generic list bypass function. used for all types of lists.
// accepts value, index, or key as matching criteria
const listTypeBypass = (v, prompt) => {
  const choice = prompt.choices.find((c, idx) => choiceMatchesValue(c, idx, v));
  if (choice != null) {
    return getChoiceValue(choice);
  }
  throw Error("invalid choice");
};

/////
// BYPASS FUNCTIONS
//

// list of prompt bypass functions by prompt type
const typeBypass = {
  confirm(v) {
    if (flag.isTrue(v)) {
      return true;
    }
    if (flag.isFalse(v)) {
      return false;
    }
    throw Error("invalid input");
  },
  checkbox(v, prompt) {
    const valList = v.split(",");
    const valuesNoMatch = valList.filter(
      (val) => !prompt.choices.some((c, idx) => choiceMatchesValue(c, idx, val))
    );
    if (valuesNoMatch.length) {
      throw Error(`no match for "${valuesNoMatch.join('", "')}"`);
    }

    return valList.map((val) =>
      getChoiceValue(
        prompt.choices.find((c, idx) => choiceMatchesValue(c, idx, val))
      )
    );
  },
  list: listTypeBypass,
  rawlist: listTypeBypass,
  expand: listTypeBypass,
};

/////
// MAIN LOGIC
//

// returns new prompts, initial answers object, and any failures
export default async function (prompts, bypassArr, plop) {
  const noop = [prompts, {}, []];
  // bail out if we don't have prompts or bypass data
  if (!Array.isArray(prompts)) {
    return noop;
  }
  if (bypassArr.length === 0) {
    return noop;
  }

  // pull registered prompts out of inquirer
  const { prompts: inqPrompts } = plop.inquirer.prompt;

  const answers = {};
  const bypassFailures = [];

  let bypassedPromptValues = [];

  /**
   * For loop to await a promise on each of these. This allows us to `await` validate functions just like
   * inquirer
   *
   * Do not turn into a Promise.all
   * We need to make sure these turn into sequential results to pass answers from one to the next
   */
  for (let idx = 0; idx < prompts.length; idx++) {
    const p = prompts[idx];

    // if the user didn't provide value for this prompt, skip it
    if (idx >= bypassArr.length) {
      bypassedPromptValues.push(false);
      continue;
    }
    const val = bypassArr[idx].toString();

    // if the user asked to be given this prompt, skip it
    if (flag.isPrompt(val)) {
      bypassedPromptValues.push(false);
      continue;
    }

    // if this prompt is dynamic, throw error because we can't know if
    // the pompt bypass values given line up with the path this user
    // has taken through the prompt tree.
    if (typeof p.when === "function") {
      bypassFailures.push(`You can not bypass conditional prompts: ${p.name}`);
      bypassedPromptValues.push(false);
      continue;
    }

    try {
      const inqPrompt = inqPrompts[p.type] || {};
      // try to find a bypass function to run
      const bypass = p.bypass || inqPrompt.bypass || typeBypass[p.type] || null;

      // get the real answer data out of the bypass function and attach it
      // to the answer data object
      const bypassIsFunc = typeof bypass === "function";
      const value = bypassIsFunc ? bypass.call(null, val, p) : val;

      // if inquirer prompt has a filter function - call it
      const answer = p.filter ? p.filter(value, answers) : value;

      // if inquirer prompt has a validate function - call it
      if (p.validate) {
        const validation = await p.validate(value, answers);
        if (validation !== true) {
          // if validation failed return validation error
          bypassFailures.push(validation);
          bypassedPromptValues.push(false);
          continue;
        }
      }

      answers[p.name] = answer;
    } catch (err) {
      // if we encounter an error above... assume the bypass value was invalid
      bypassFailures.push(
        `The "${p.name}" prompt did not recognize "${val}" as a valid ${p.type} value (ERROR: ${err.message})`
      );
      bypassedPromptValues.push(false);
      continue;
    }

    // if we got this far, we successfully bypassed this prompt
    bypassedPromptValues.push(true);
  }

  // generate a list of prompts that the user is bypassing
  const bypassedPrompts = prompts.filter((_, i) => bypassedPromptValues[i]);

  // rip out any prompts that have been bypassed
  const promptsAfterBypass = [
    // first prompt will copy the bypass answer data so it's available
    // for prompts and actions to use
    { when: (data) => (Object.assign(data, answers), false) },
    // inlcude any prompts that were NOT bypassed
    ...prompts.filter((p) => !bypassedPrompts.includes(p)),
  ];

  // if we have failures, throw the first one
  if (bypassFailures.length) {
    throw Error(bypassFailures[0]);
  } else {
    // return the prompts that still need to be run
    return [promptsAfterBypass, answers];
  }
  // BOOM!
}
