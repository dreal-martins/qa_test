import { spawn } from "child_process";

const child = spawn("npx", ["jest", "--runInBand"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  if (code === 0) {
    console.log("✅ Test passed.");
  } else {
    console.error("❌ Test failed.");
    process.exit(code ?? 1);
  }
});
