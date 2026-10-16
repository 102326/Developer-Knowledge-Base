import fs from "node:fs"
import path from "node:path"
import yaml from "js-yaml"
const config = yaml.load(fs.readFileSync("quartz.config.yaml", "utf8"))
const prefix = new URL("https://" + config.configuration.baseUrl).pathname.replace(/\/$/, "")
const index = JSON.parse(fs.readFileSync("public/static/contentIndex.json", "utf8"))
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
let pages = 0
for (const file of walk("content").filter((f) => f.endsWith(".md"))) {
  const fm =
    yaml.load(fs.readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "") ?? {}
  const slug = file.slice("content/".length, -3)
  const published = fm.publish === true && fm.draft !== true
  if (published) {
    if (!fs.existsSync(`public/${slug}.html`) || !index[slug])
      throw new Error(`Missing selected page/index: ${slug}`)
    pages++
  } else if (fs.existsSync(`public/${slug}.html`) || index[slug])
    throw new Error(`Filtered page leaked: ${slug}`)
}
if (!pages) throw new Error("No selected pages emitted")
const script = fs.readFileSync("public/postscript.js", "utf8")
if (/fetch\(["']\/static\/contentIndex\.json/.test(script))
  throw new Error("Unpatched root index fetch")
if (prefix && script.split(prefix + "/").length < 3)
  throw new Error("Missing search/explorer subpath helpers")
console.log(
  `PASS: ${pages} selected pages exist in HTML/search index; filtered pages absent; static subpath assertions pass.`,
)
