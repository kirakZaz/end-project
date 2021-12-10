const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../views/index.html"));

jest.dontMock("fs");

describe("mainDivUsers", function () {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("mainDivUsers exists", function () {
    expect(document.getElementsByClassName("mainDivUsers")).toBeTruthy();
  });
});
