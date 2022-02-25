export default function (plop) {
  plop.setGenerator("node-plop-test", {
    prompts: [
      {
        type: "input",
        name: "name",
        message: function () {
          return "test name";
        },
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "test name is required";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/node-plop/tests/{{dashCase name}}/{{dashCase name}}.spec.js",
        templateFile: "plop-templates/node-plop-test.js",
      },
    ],
  });

  plop.setGenerator("plop-test", {
    prompts: [
      {
        type: "input",
        name: "name",
        message: function () {
          return "test name";
        },
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "test name is required";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/plop/tests/{{dashCase name}}.spec.js",
        templateFile: "plop-templates/plop-test.js",
      },
    ],
  });
}
