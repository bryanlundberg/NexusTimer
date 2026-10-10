import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const MAVEN = 'https://repo1.maven.org/maven2'
const TNOODLE = 'org.worldcubeassociation.tnoodle'

const JARS = [
  [TNOODLE, 'lib-scrambles', '0.20.0', '1e053cce612b267c66db302650a5725ffb0182b14e65ac380bea6fd731ae0629'],
  [TNOODLE, 'scrambler-min2phase', '0.20.0', '0ab2b82e4ee7feaca87a27f7f81343334c73613ce5a6b757933422eb871444db'],
  [TNOODLE, 'scrambler-threephase', '0.20.0', '2b7ea2a61d571fa91bce37c95c8b852b9ca331d16657dc80022d8e57879708c3'],
  [TNOODLE, 'scrambler-sq12phase', '0.20.0', 'dfdb12c1b8effd9e4aab7e64ea9d8342b5ef6e1cec8d2296434dd264141c91de'],
  [TNOODLE, 'scrambler-fto3phase', '0.20.0', '2adde92a269023f6c7e18a476eb6cb0ca90e7e11f5f8548e2b1b9be6e8452501'],
  [TNOODLE, 'lib-svglite', '0.20.0', '37ddb15bf0663b3f5ac37d051fba17151b531b6c97292566965b1f77763a1337'],
  ['org.slf4j', 'slf4j-api', '2.0.10', 'b7ddb31a515debbddec8e9145e2cf7b197926f40e454376647724f92e6382043'],
  ['org.timepedia.exporter', 'gwtexporter', '2.5.1', 'b47583dd02d41f4c037659d7573b796ddc3eddc44c9effc5c925cc920ddc3c64']
]

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')

const dir = new URL('./lib/', import.meta.url)
await mkdir(dir, { recursive: true })

for (const [group, artifact, version, expected] of JARS) {
  const name = `${artifact}-${version}.jar`
  const file = new URL(name, dir)
  const existing = await readFile(file).catch(() => null)
  if (existing && sha256(existing) === expected) continue

  const url = `${MAVEN}/${group.replaceAll('.', '/')}/${artifact}/${version}/${name}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  if (sha256(bytes) !== expected) throw new Error(`${name}: checksum mismatch`)
  await writeFile(file, bytes)
  console.log(`fetched ${name}`)
}
