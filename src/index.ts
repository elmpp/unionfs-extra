// @ts-nocheck
import walkSync, {Options as WalkOptions} from 'walk-sync'
import {
  fsSyncMethodsReadable,
  fsAsyncMethodsReadable,
  fsPromiseMethodsReadable,
  fsAsyncMethodsWritable,
  fsSyncMethodsWritable,
  fsPromiseMethodsWritable,
  IFS,
} from 'unionfs'
// import {IFs} from 'memfs'
import debugModule from 'debug'
import path from 'path'
// import fs from 'fs'

const debugError = debugModule('unionfs')
const debugInfo = debugModule('unionfs').bind(console.log)

type Options = Pick<WalkOptions, 'globs' | 'ignore'>

// export type FSLike = typeof fs
export type FSLike = IFS

/**
 mergeDown effectively compacts the contents of a volume down onto another

 @remarks

 @example
```ts
 import {mergeDown} from 'unionfs-extra' // alternatively 'unionfs-extra/dist/mergeDown'
 import {Volume} from 'memfs'

 const volUpper = Volume.fromJSON({'/a': 'its-an-extender', '/baseDir/b': 'cock-piss-partridge'}, {'/a': 'toblerones'})
 const a = mergeDown(volUpper, volLower)
 console.log(a.toJSON()) // {"/a": "its-an-extender", "/baseDir/b": 'cock-piss-partridge"}
```
 */
export const mergeDown = (volUpper: FSLike, volLower: FSLike, options: Options): FSLike => {}

// !@todo - message this guy about copying - https://github.com/tophat/semantic-release-firefox-add-on/pull/91#discussion_r393291566
/**
 mkdirpProxy will ensure that all directories for a given path exist when a write operation is attempted
 on a volume

 @remarks

 @example
```ts
 import {mkdirpProxy} from 'unionfs-extra'
 import {Union} from 'unionfs'

 const union = new Union()
 const vol1 = Volume.fromJSON({})
 union.use(mkdirpProxy(vol1))
 union.writeFileSync('/some-dir1/some-dir2/somefile.txt', 'some content', 'utf8') // will create `/some-dir1/some-dir2/` before `somefile.txt`
```
 */
export const mkdirpProxy = (vol: FSLike): FSLike => {
  return new Proxy(vol, {
    get(target: FSLike, method: string) {
      // @ts-ignore
      if (target[method] && typeof target[method] === 'function' && isWriteMethod(method)) {
        return (...args: string[]) => {
          const targetPath = args[0] // assuming always first?
          const realpath = target.realpathSync(targetPath, {encoding: 'utf8'}) as string
          if (!realpath.includes('/')) {
            debugError(`Incorrect path or same directory: '${path}'. Method: '${method}'`)
            // @ts-ignore
            return target[method]
          }
          const targetDir = path.dirname(realpath)
          target.mkdirSync(targetDir, {recursive: true})
          debugInfo(`Created directories up to '${targetDir}'`)
        }
      }
      // @ts-ignore
      return target[method]
    },
  }) as FSLike
}

/**
 e.g. readFileSync, promise.open, writeFile
 */
const getMethodType = (method: string): ['read' | 'write' | 'all', 'sync' | 'async' | 'promise'] => {
  if (method.startsWith('promise')) {
    return [
      (fsPromiseMethodsReadable as readonly string[]).includes(method.slice(8))
        ? 'read'
        : (fsPromiseMethodsWritable as readonly string[]).includes(method.slice(8))
        ? 'write'
        : 'all',
      'promise',
    ]
  }
  if (method.endsWith('Sync') || method.endsWith('Stream')) {
    return [
      (fsSyncMethodsReadable as readonly string[]).includes(method.slice(8))
        ? 'read'
        : (fsSyncMethodsWritable as readonly string[]).includes(method.slice(8))
        ? 'write'
        : 'all',
      'sync',
    ]
  }
  return [
    (fsAsyncMethodsReadable as readonly string[]).includes(method.slice(8))
      ? 'read'
      : (fsAsyncMethodsReadable as readonly string[]).includes(method.slice(8))
      ? 'write'
      : 'all',
    'async',
  ]
}

// const isReadMethodAsync = (method: string): boolean => {
//   return ([...fsSyncMethodsReadable, ...fsAsyncMethodsReadable, ...fsPromiseMethodsReadable] as string[]).includes(
//     method
//   )
// }
// const isWriteMethod = (method: string): boolean => {
//   return ([...fsSyncMethodsWritable, ...fsAsyncMethodsWritable, ...fsPromiseMethodsWritable] as string[]).includes(
//     method
//   )
// }
