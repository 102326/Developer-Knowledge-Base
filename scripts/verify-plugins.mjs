import fs from "node:fs"
import { execFileSync } from "node:child_process"
const { plugins } = JSON.parse(fs.readFileSync("quartz.lock.json", "utf8"))
for (const [name, p] of Object.entries(plugins)) {
  const cwd = `.quartz/plugins/${name}`
  const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" }).trim()
  if (sha !== p.commit || !fs.existsSync(`${cwd}/dist/index.js`))
    throw new Error(`${name}: commit mismatch or missing build`)
}
console.log(
  `PASS: ${Object.keys(plugins).length} plugin commits match quartz.lock.json and have built entries.`,
)
