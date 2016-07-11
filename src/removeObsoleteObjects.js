/* eslint no-console:0 */
'use strict'

const Promise = require('bluebird')
const idsToKeep = require('./idsNotToRemove.js')

module.exports = (db, objects, cscf) => {
  const promises = []
  const cscfGuids = cscf.map((c) => c.guid)
  console.log('removeObsoleteObjects.js, cscf[0]', cscf[0])
  console.log('removeObsoleteObjects.js, objects[0]', objects[0])
  objects.forEach((o, index) => {
    if (index === 0) {
      console.log('removeObsoleteObjects.js, o._id', o._id)
      console.log('removeObsoleteObjects.js, idsToKeep.includes(o._id)', idsToKeep.includes(o._id))
      console.log('removeObsoleteObjects.js, o._id', o._id)
      console.log('removeObsoleteObjects.js, o._id', o._id)
    }
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
        .then(() => objects.splice(index, 1))
        .catch((error) => console.error(`Error removing object ${o._id}:`, error))
      promises.push(promise)
    }
  })

  return Promise.all(promises, { concurrency: 1 })
}
