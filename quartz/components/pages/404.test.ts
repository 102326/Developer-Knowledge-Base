import test from "node:test"
import assert from "node:assert/strict"
import { renderToString } from "preact-render-to-string"
import NotFoundConstructor from "./404"
import type { GlobalConfiguration } from "../../cfg"
import type { QuartzComponentProps } from "../types"

const NotFound = NotFoundConstructor()

for (const [baseUrl, expectedHome] of [
  ["example.com", "/"],
  ["example.com/project", "/project/"],
  ["example.com/project/", "/project/"],
]) {
  test(`404 home keeps relative article links under ${baseUrl}`, () => {
    // This component only reads cfg; other page-rendering inputs are not needed.
    const cfg = { baseUrl, locale: "zh-CN" } as GlobalConfiguration
    const html = renderToString(NotFound({ cfg } as QuartzComponentProps))
    const home = html.match(/<a href="([^"]+)"/)?.[1]
    assert.ok(home)
    const article = new URL("./skills/overview", new URL(home, "https://example.com"))
    assert.equal(article.pathname, `${expectedHome}skills/overview`)
  })
}
