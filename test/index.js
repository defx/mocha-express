import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { spawnSync } from "child_process";
import assert from "assert";
import { fileURLToPath } from "url";

// fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function runCli(cwd, args = []) {
  return spawnSync("node", [join(__dirname, "../src/index.js"), ...args], {
    cwd,
    encoding: "utf8",
  });
}

describe("CLI test runner", function () {
  this.timeout(10000);

  let tmp;

  beforeEach(function () {
    tmp = mkdtempSync(join(tmpdir(), "cli-runner-"));
  });

  afterEach(function () {
    rmSync(tmp, { recursive: true, force: true });
  });

  it("runs a passing test", function () {
    const testFile = join(tmp, "example.test.js");

    writeFileSync(
      testFile,
      `
      it("adds numbers", function () {
        if (1 + 2 !== 3) throw new Error("Math is broken");
      });
    `
    );

    const result = runCli(tmp);

    assert.strictEqual(result.status, 0);
    assert.match(result.stdout, /1 passing/);
  });

  it("reports a failing test", function () {
    const testFile = join(tmp, "fail.test.js");

    writeFileSync(
      testFile,
      `
      it("fails intentionally", function () {
        throw new Error("Expected failure");
      });
    `
    );

    const result = runCli(tmp);

    assert.notStrictEqual(result.status, 0);
    assert.match(result.stdout, /1 failing/);
    assert.match(result.stdout, /fails intentionally/);
  });
});
