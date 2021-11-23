module.exports = function (plop) {
  plop.setGenerator("addAndNameFIle", {
    description: "Name that file",
    prompts: [
      {
        type: "input",
        name: "fileName",
        message: "What should the file name be?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./output/{{fileName}}.txt",
        templateFile: "./templates/to-add.txt",
      },
    ],
  });
};
