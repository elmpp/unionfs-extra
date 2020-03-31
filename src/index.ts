import fs from 'fs'
import util from 'util'
import pkgJsonResolve from 'package-json-resolved'
import pkgPathParse from 'package-path-parse'

export type NameFilter = (parts: NonNullable<ReturnType<typeof pkgPathParse>>) => boolean
export type PkgFilter = (pkg: Record<string, any>) => boolean
interface Options {
  nameFilter?: NameFilter
  pkgFilter?: PkgFilter
  type?: 'dependencies' | 'devDependencies' | 'optionalDependencies' | 'peerDependencies'
}

const asyncReadFile = util.promisify(fs.readFile)

/**
 Filter a package.json dependencies by name and resolved package.json content

 @remarks

 Accepts 2 filter iteratees
  - First to be ran against the package names within dependencies found in package.json
  - Second to accept the package.json contents of each resolved package

 {@link https://tinyurl.com/ve2bc9f | inspired by sindresorhus/resolve-from }

 @example
```ts
 import depsFilter from 'unionfs-extra'
 const a = depsFilter('resolvedPath', {
   nameFilter: (\{name, scope, suffix\}) => name.match(/^mnt-.+/),
   pkgFilter: pkg => pkgJson.keywords?.includes('hummus')
 })
```
 */
async function depsFilter(aPath: string, options: Options & {silent: false}): Promise<string[]>
async function depsFilter(aPath: string, options: Options & {silent: true}): Promise<string[] | undefined>
async function depsFilter(aPath: string, options: Options & {silent?: undefined}): Promise<string[]>
async function depsFilter(aPath: string, options: Options & {silent?: boolean}): Promise<string[] | undefined> {
  const {silent, nameFilter, pkgFilter, type = 'dependencies'} = options
  try {
    const pkg = JSON.parse(await asyncReadFile(aPath, {encoding: 'utf-8'}))
    const deps = Object.entries(pkg[type]).reduce<string[]>((acc, [name, _pkgVersion]) => {
      if (!nameFilter || nameFilter(pkgPathParse(name))) acc.push(name)
      return acc
    }, [])
    if (!pkgFilter) return deps
    const pkgJsons = await Promise.all(deps.map(dep => pkgJsonResolve(dep, {cwd: __dirname})))
    return pkgJsons.filter(pkgJson => pkgFilter(pkgJson)).map(({name}) => name)
  } catch (error) {
    if (error.code === 'ENOENT' && silent) return
    throw error
  }
}

export default depsFilter
