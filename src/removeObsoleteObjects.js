/* eslint no-console:0, func-names:0, prefer-arrow-callback:0 */
'use strict'

const async = require('async')
const idsToKeep = require('./idsToKeep.js')

module.exports = (db, objects, cscf) => {
  const q = async.queue(function (o, callback) {
    db.remove(o._id, o._rev, function () {
      // seems that async needs this callback
      callback()
    })
  })
  q.drain = function () {
    console.log('obsolete objects removed')
  }
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
      q.push(o, function () {
        // do nothing
      })
    }
  })
}
