const fs = require("fs");
const { resolve } = require("path");

exports.getFileHelper = () => {
  let cleanupFile = null;

  afterEach(() => {
    if (!cleanupFile) return;
    try {
      fs.unlinkSync(cleanupFile);
    } catch (e) {}
    cleanupFile = null;
  });

  const getFilePath = async (path) => {
    const expectedFilePath = resolve(__dirname, path);

    cleanupFile = expectedFilePath;
    try {
      await fs.promises.unlink(cleanupFile);
    } catch (e) {}

    return expectedFilePath;
  };

  return {
    getFilePath,
  };
};
