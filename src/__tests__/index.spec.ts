import {mkdirpProxy, FSLike} from '../index'
import {Volume, createFsFromVolume} from 'memfs'
import {Union} from 'unionfs'

describe('mkdirpProxy', () => {
  describe('sync', () => {
    it('creates directories when non existent', () => {
      const vol1 = createFsFromVolume(Volume.fromJSON({'/existing-dir/existing-file.txt': 'existing-content'}))
      const ufs = new Union().use(mkdirpProxy(vol1) as FSLike)
    })
  })
})
