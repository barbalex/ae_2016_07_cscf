/* eslint no-console:0 */
'use strict'

const async = require('async')
const idsToKeep = require('./idsToKeep.js')

module.exports = (db, objects, cscf) => {
  const callbacks = []
  const cscfGuids = cscf.map((c) => c.guid)
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
