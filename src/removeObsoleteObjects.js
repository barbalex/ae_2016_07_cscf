/* eslint no-console:0 */
'use strict'

const Promise = require('bluebird')
const idsToKeep = require('./idsNotToRemove.js')

module.exports = (db, objects, cscf) => {
  const promises = []
  const cscfGuids = cscf.map((c) => c.guid)
  objects.forEach((o, index) => {
    if (
      !idsToKeep.includes(o._id) &&
      o['Taxonomie ID'] < 1000000 &&
      !cscfGuids.includes(o._id)
    ) {
      // this object is obsolete
      const promise = db.removeAsync(o)
        .then(() => objects.splice(index, 1))
        .catch((error) => console.error(`Error removing object ${o._id}:`, error))
      promises.push(promise)
    }
  })

  return Promise.map(promises, { concurrency: 1 })
}
