/* eslint no-console:0 */
'use strict'

const Promise = require('bluebird')
const idsToKeep = require('./idsToKeep.js')

module.exports = (db, objects, cscf) => {
  const promises = []
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
      const promise = db.removeAsync(o)
        .catch((error) => console.error(`Error removing object ${o._id}:`, error))

      promises.push(promise)
    }
  })

  return Promise.all(promises)
}
