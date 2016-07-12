/* eslint no-console:0 */
'use strict'

const Promise = require('bluebird')
const async = require('async')
const idsToKeep = require('./idsToKeep.js')

module.exports = (db, objects, cscf) => {
  // console.log('removeObsoleteObjects.js objects[0]:', objects[0])
  // console.log('removeObsoleteObjects.js cscf[0]:', cscf[0])
  const callbacks = []
  const cscfGuids = cscf.map((c) => c.guid)
  console.log('removeObsoleteObjects.js cscfGuids[0]:', cscfGuids[0])
  objects.forEach((o) => {
    if (
      !idsToKeep.includes(o._id) &&
      !cscfGuids.includes(o._id) &&
      (
        o.Taxonomie &&
        o.Taxonomie.Eigenschaften &&
        o.Taxonomie.Eigenschaften['Taxonomie ID'] &&
        o.Taxonomie.Eigenschaften['Taxonomie ID'] < 1000000
      )
    ) {
      // console.log('removeObsoleteObjects.js o to delete:', o)
      // this object is obsolete
      const callback = db.remove(o._id, o._rev)
      callbacks.push(callback)
    }
  })

  async.series(callbacks, function(err) {
    if (err) return console.log('removeObsoleteObjects.js Error:', err)
    return
  })
}
