import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const viteEntry = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const serverEntry = fileURLToPath(new URL("../server/index.js", import.meta.url));
const viteEnvironment = { ...process.env };
delete viteEnvironment.GEMINI_API_KEY;
const children = [
  spawn(process.execPath, [viteEntry], { cwd: projectRoot, stdio: "inherit", env: viteEnvironment }),
  spawn(process.execPath, [serverEntry], { cwd: projectRoot, stdio: "inherit", env: process.env }),
];

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill("SIGTERM");
  }
  process.exitCode = exitCode;
}

for (const child of children) {
  child.on("error", (error) => {
    process.stderr.write(`Could not start a development process: ${error.message}\n`);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!stopping) stop(code ?? 1);
  });
}

process.once("SIGINT", () => stop());
process.once("SIGTERM", () => stop());
