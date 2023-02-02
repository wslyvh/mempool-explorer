import dotenv from "dotenv"
import fs, { readdirSync, statSync, unlinkSync } from "fs"

dotenv.config()

Cleanup()

export async function Cleanup() {
  console.log("Delete old txpool_content..")

  const dir = "./src/data/"
  const items = readdirSync(dir, { withFileTypes: true })
    .filter((i) => i.isFile() && i.name.endsWith(".json"))
    .sort((a, b) => statSync(dir + a.name).mtime.getTime() - statSync(dir + b.name).mtime.getTime())
    .map((i) => i.name)

  const del = items.slice(20, items.length)
  for (const item in del) {
    unlinkSync(dir + del[item])
  }
}
