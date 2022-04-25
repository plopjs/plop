module.exports = function (plop) {
  "use strict";

  plop.setGenerator("make-regex", {
    prompts: [
      {
        type: "input",
        name: "regexName",
        message: "What's the regex name?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "name is required";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/{{regexName}}.txt",
        templateFile: "plop-templates/regex.txt",
      },
    ],
  });

  plop.setGenerator("append-to-regex", {
    prompts: [
      {
        type: "input",
        name: "regexName",
        message: "What's the file  name?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "name is required";
        },
      },
      {
        type: "input",
        name: "name",
        message: "What's the package name?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "name is required";
        },
      },
    ],
    actions: [
      {
        type: "append",
        path: "src/{{regexName}}.txt",
        pattern: /-- APPEND ITEMS HERE --/gi,
        template:
          '{handle: "[data-{{ dashCase name}}]", require: {{properCase name}} }\\,',
      },
    ],
  });
};
