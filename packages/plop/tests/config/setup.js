// require("cli-testing-library/extend-expect");

import { configure } from "cli-testing-library";
import "cli-testing-library/extend-expect";

configure({
  asyncUtilTimeout: 8000,
  renderAwaitTime: 4000,
  errorDebounceTimeout: 4000,
});
