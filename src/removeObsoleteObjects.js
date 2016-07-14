/* eslint no-console:0 */
'use strict'

const async = require('async')
const idsToKeep = require('./idsToKeep.js')

module.exports = (db, objects, cscf) => {
  const callbacks = []
  const cscfTaxIds = cscf.map((c) => c.TaxonomieId)
  objects.forEach((o) => {
    if (
      !idsToKeep.includes(o._id) &&
      (
        o.Taxonomie &&
        o.Taxonomie.Eigenschaften &&
        o.Taxonomie.Eigenschaften['Taxonomie ID'] &&
        o.Taxonomie.Eigenschaften['Taxonomie ID'] < 1000000 &&
        !cscfTaxIds.includes(o.Taxonomie.Eigenschaften['Taxonomie ID'])
      )
    ) {
      // this object is obsolete
      const callback = db.remove(o._id, o._rev, function () {
        // seems that async needs this callback
      })
      callbacks.push(callback)
    }
  })

  if (callbacks.length === 0) return console.log(`${callbacks.length} obsolete objects removed`)
  async.series(callbacks, function (err) {
    if (err) return console.log('removeObsoleteObjects.js Error:', err)
    return console.log(`${callbacks.length} obsolete objects removed`)
  })
}
