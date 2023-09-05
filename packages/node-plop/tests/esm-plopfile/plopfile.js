import fs from "fs";
import { join } from "path";

export default function (plop) {
  ///////
  // helpers are passed through to handlebars and made
  // available for use in the generator templates
  //

  // adds 4 dashes around some text (yes es6/es2015 is supported)
  plop.setHelper("dashAround", function (text) {
    return "---- " + text + " ----";
  });
  // plop.setHelper('dashAround', (text) => '---- ' + text + ' ----');

  // formats an array of options like you would write
  // it if you were speaking (one, two, and three)
  plop.setHelper("wordJoin", function (words) {
    return words.join(", ").replace(/(:?.*),/, "$1, and");
  });

  // greet the user using a partial
  plop.setPartial(
    "salutation",
    "my name is {{ properCase name }} and I am {{ age }}.",
  );

  // setGenerator creates a generator that can be run with "plop generatorName"
  plop.setGenerator("basic-add", {
    description: "adds a file using a template",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is your name?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "name is required";
        },
      },
      {
        type: "input",
        name: "age",
        message: "How old are you?",
        validate: function (value) {
          var digitsOnly = /\d+/;
          if (digitsOnly.test(value)) {
            return true;
          }
          return "Invalid age! Must be a number genius!";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{dashCase name}}.txt",
        templateFile: "plop-templates/add.txt",
        abortOnFail: true,
      },
    ],
  });
}
