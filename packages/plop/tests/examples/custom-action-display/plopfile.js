export default function (plop) {
  plop.setActionTypeDisplay("add", "><");
  plop.setGenerator("addFile", {
    description: "Add a file",
    prompts: [],
    actions: [
      {
        type: "add",
        path: "./output/out.txt",
        templateFile: "./templates/to-add.txt",
      },
    ],
  });
}
