import fs from "node:fs"
import { execFileSync } from "node:child_process"
import yaml from "js-yaml"
const config = yaml.load(fs.readFileSync("quartz.config.yaml", "utf8"))
const prefix = new URL("https://" + config.configuration.baseUrl).pathname.replace(/\/$/, "")
const lock = JSON.parse(fs.readFileSync("quartz.lock.json", "utf8"))
const changes = {
  search: [
    [
      'new URL("/" + slug, window.location.origin)',
      "new URL(dkbSitePath(slug), window.location.origin)",
    ],
    ['itemTile.href = "/" + item.slug;', "itemTile.href = dkbSitePath(item.slug);"],
    ['fetch("/static/contentIndex.json")', 'fetch(dkbSitePath("static/contentIndex.json"))'],
  ],
  explorer: [
    ['fetch("/static/contentIndex.json")', 'fetch(dkbSitePath("static/contentIndex.json"))'],
    [
      'folderLink.href = "/" + (folderHref || "");',
      'folderLink.href = dkbSitePath(folderHref || "");',
    ],
    ['link.href = "/" + node.data.slug;', "link.href = dkbSitePath(node.data.slug);"],
  ],
}
for (const [name, replacements] of Object.entries(changes)) {
  const cwd = `.quartz/plugins/${name}`
  const file = `src/components/scripts/${name}.inline.ts`
  const sha = execFileSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" }).trim()
  if (sha !== lock.plugins[name].commit) throw new Error(`${name}: unexpected source commit`)
  // Always derive from the pinned original, so reruns and a changed baseUrl are deterministic.
  let source = execFileSync("git", ["show", `HEAD:${file}`], { cwd, encoding: "utf8" })
  for (const [before, after] of replacements) {
    if (source.split(before).length !== 2)
      throw new Error(`${name}: patch context drift: ${before}`)
    source = source.replace(before, after)
  }
  const current = fs.readFileSync(`${cwd}/${file}`, "utf8")
  const original = execFileSync("git", ["show", `HEAD:${file}`], { cwd, encoding: "utf8" })
  const marker = "// DKB repository-subpath compatibility; see scripts/apply-subpath-compat.mjs.\n"
  const helperPattern =
    /^const dkbSitePath = \(slug: string\): string => ("(?:[^"\\]|\\.)*") \+ slug\.replace\(\/\^\\\/\/, ""\);\n/
  let existingPatch = current.startsWith(marker) ? current.slice(marker.length) : ""
  const match = existingPatch.match(helperPattern)
  const matchesGenerated = match && existingPatch.slice(match[0].length) === source
  if (current !== original && !matchesGenerated)
    throw new Error(`${name}: local edits detected; refusing to overwrite`)
  source =
    `// DKB repository-subpath compatibility; see scripts/apply-subpath-compat.mjs.\nconst dkbSitePath = (slug: string): string => ${JSON.stringify(prefix + "/")} + slug.replace(/^\\//, "");\n` +
    source
  fs.writeFileSync(`${cwd}/${file}`, source)
  execFileSync("npm", ["install", "--include=dev"], { cwd, stdio: "inherit" })
  execFileSync("npm", ["run", "build"], { cwd, stdio: "inherit" })
  execFileSync("npm", ["prune", "--omit=dev"], { cwd, stdio: "inherit" })
  console.log(`Patched ${name} for ${prefix || "/"} at pinned ${sha}`)
}
