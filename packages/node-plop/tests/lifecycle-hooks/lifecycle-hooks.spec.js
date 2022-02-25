import nodePlop from "../../src/index.js";
import { setupMockPath } from "../helpers/path.js";
const { clean } = setupMockPath(import.meta.url);

describe("lifecycle-hooks", function () {
  afterEach(clean);

  const errAction = () => {
    throw Error("");
  };

  // onSuccess and onFailure Lifecycle hooks
  test("Lifecycle hooks test (onSuccess, onFailure)", async function () {
    const plop = await nodePlop();
    const onSuccess = () => onSuccess.called++;
    onSuccess.called = 0;
    const onFailure = () => onFailure.called++;
    onFailure.called = 0;

    await plop
      .setGenerator("", { actions: [() => "yes", errAction] })
      .runActions({}, { onSuccess, onFailure });

    expect(onSuccess.called).toBe(1);
    expect(onFailure.called).toBe(1);
  });

  test("Lifecycle hooks negative scenario test (onSuccess)", async function () {
    const plop = await nodePlop();
    const onSuccess = () => onSuccess.called++;
    onSuccess.called = 0;
    const onFailure = () => onFailure.called++;
    onFailure.called = 0;

    await plop
      .setGenerator("", { actions: [errAction, errAction] })
      .runActions({}, { onSuccess, onFailure });

    expect(onSuccess.called).toBe(0);
    expect(onFailure.called).toBe(2);
  });

  test("Lifecycle hooks negative scenario test (onFailure)", async function () {
    const plop = await nodePlop();
    const onSuccess = () => onSuccess.called++;
    onSuccess.called = 0;
    const onFailure = () => onFailure.called++;
    onFailure.called = 0;

    await plop
      .setGenerator("", { actions: [() => "yes", () => "yes"] })
      .runActions({}, { onSuccess, onFailure });

    expect(onSuccess.called).toBe(2);
    expect(onFailure.called).toBe(0);
  });

  test("Lifecycle hook test (onComment)", async function () {
    const plop = await nodePlop();
    const onSuccess = () => onSuccess.called++;
    onSuccess.called = 0;
    const onFailure = () => onFailure.called++;
    onFailure.called = 0;
    const onComment = () => onComment.called++;
    onComment.called = 0;

    await plop
      .setGenerator("", { actions: ["yes", () => "yes", errAction, "yes"] })
      .runActions({}, { onSuccess, onFailure, onComment });

    expect(onSuccess.called).toBe(1);
    expect(onFailure.called).toBe(1);
    expect(onComment.called).toBe(1);
  });
});
