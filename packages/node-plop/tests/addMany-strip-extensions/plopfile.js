export default function (plop) {
  // setGenerator creates a generator that can be run with "plop generatorName"
  plop.setGenerator("add-many-strip-extensions", {
    description: "adds multiple files removing extensions",
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
        destination: "src/",
        stripExtensions: ["hbs"],
        templateFiles: "plop-templates/remove-hbs/*",
        abortOnFail: true,
      },
      {
        type: "addMany",
        destination: "src/",
        stripExtensions: true,
        templateFiles: "plop-templates/remove-all/*",
        abortOnFail: true,
      },
      {
        type: "addMany",
        destination: "src/",
        stripExtensions: ["hbs"],
        templateFiles: "plop-templates/remove-dotfile-hbs/*",
        abortOnFail: true,
        globOptions: { dot: true },
      },
      {
        type: "addMany",
        destination: "src/",
        stripExtensions: ["hbs"],
        templateFiles: "plop-templates/remove-noextension-hbs/*",
        abortOnFail: true,
      },
    ],
  });
}
