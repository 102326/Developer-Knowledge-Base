import fs from "node:fs"
import path from "node:path"
import yaml from "js-yaml"
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
const files = walk("content")
const errors = []
for (const file of files) {
  if (!file.endsWith(".md")) {
    console.warn(`REVIEW: non-Markdown asset may be published: ${file}`)
    continue
  }
  const text = fs.readFileSync(file, "utf8")
  const fm = text.match(/^---\n([\s\S]*?)\n---/)
  const data = fm ? yaml.load(fm[1]) : {}
  if (typeof data.publish !== "boolean" || typeof data.draft !== "boolean")
    errors.push(`Explicit boolean publication flags missing: ${file}`)
  if (data.publish === true && data.draft === true)
    errors.push(`Contradictory publication flags: ${file}`)
  for (const m of text
    .replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, "")
    .matchAll(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
    const href = m[1]
    if (/^(?:[a-z]+:|#)/i.test(href)) continue
    const target = decodeURIComponent(href.split("#")[0])
    if (target && !fs.existsSync(path.resolve(path.dirname(file), target)))
      errors.push(`Broken relative link: ${file} -> ${href}`)
  }
}
const config = yaml.load(fs.readFileSync("quartz.config.yaml", "utf8"))
for (const name of ["explicit-publish", "remove-draft"])
  if (!config.plugins.some((p) => p.source.endsWith("/" + name) && p.enabled))
    errors.push(`Missing filter ${name}`)
if (config.plugins.some((p) => p.source.endsWith("/graph") && p.enabled))
  errors.push("Graph enabled")
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(
  `PASS: ${files.length} content files; explicit publication flags and relative link targets valid.`,
)
