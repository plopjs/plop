export default function (plop) {
  plop.setGenerator("make-list", {
    prompts: [
      {
        type: "input",
        name: "listName",
        message: "What's the list name?",
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
        path: "src/{{listName}}.txt",
        templateFile: "plop-templates/list.txt",
      },
    ],
  });

  plop.setGenerator("prepend-to-list", {
    description: "prepend entry to a list",
    prompts: [
      {
        type: "input",
        name: "listName",
        message: "What's the list name?",
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
        message: "What is your name?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "name is required";
        },
      },
      {
        type: "confirm",
        name: "allowDuplicates",
        message: "Allow Duplicates?",
      },
    ],
    actions: ({ allowDuplicates }) => [
      {
        type: "prepend",
        path: "src/{{listName}}.txt",
        pattern: /-- PREPEND ITEMS HERE --/gi,
        template: "name: {{name}}1",
        unique: !allowDuplicates,
      },
      {
        type: "prepend",
        path: "src/{{listName}}.txt",
        pattern: "/* PREPEND OTHER ITEMS HERE */",
        template: "name: {{name}}2",
        unique: !allowDuplicates,
      },
    ],
  });

  plop.setGenerator("prepend-without-pattern", {
    description: "prepend entry to a list without pattern",
    prompts: [
      {
        type: "input",
        name: "listName",
        message: "What's the list name?",
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
        message: "What is your name?",
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "name is required";
        },
      },
      {
        type: "confirm",
        name: "allowDuplicates",
        message: "Allow Duplicates?",
      },
    ],
    actions: ({ allowDuplicates }) => [
      {
        type: "prepend",
        path: "src/{{listName}}.txt",
        template: "name: {{name}}1",
        unique: !allowDuplicates,
      },
      {
        type: "prepend",
        path: "src/{{listName}}.txt",
        template: "name: {{name}}2",
        unique: !allowDuplicates,
      },
    ],
  });
}
