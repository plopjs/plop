export default function (plop) {
  // setGenerator creates a generator that can be run with "plop generatorName"
  plop.setGenerator("multiple-adds", {
    description: "adds multiple files from a glob",
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
    ],
    actions: [
      {
        type: "addMany",
        destination: "src/{{dashCase name}}/",
        templateFiles: "plop-templates/**/*.txt",
        abortOnFail: true,
      },
      {
        type: "addMany",
        destination: "src/base-{{dashCase name}}/",
        templateFiles: "plop-templates/**/*.txt",
        base: "plop-templates/nested-folder/",
        abortOnFail: true,
      },
      {
        type: "addMany",
        destination: "src/components",
        templateFiles: "plop-templates/components/**/*",
        base: "plop-templates/components/logic",
        abortOnFail: true,
      },
      {
        type: "addMany",
        destination: "src/array-{{dashCase name}}/",
        templateFiles: [
          "plop-templates/*.txt",
          "plop-templates/nested-folder/*.txt",
        ],
        base: "plop-templates/",
        abortOnFail: true,
      },
      {
        type: "addMany",
        destination: "src/{{dashCase name}}-dot/",
        templateFiles: () => "plop-templates/*",
        globOptions: { dot: true },
        abortOnFail: true,
      },
    ],
  });
}
