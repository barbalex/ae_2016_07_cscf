/* eslint no-console:0 */

'use strict'

const Promise = require('bluebird')
const taxIdsNew = require('./taxIdNew.js')

module.exports = (db, objects) => {
  const promises = []
  taxIdsNew.forEach((tax) => {
    // find object
    const object = objects.find((o) => o._id === tax.GUID)
    if (object) {
      if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften['Taxonomie ID']) {
        // update nuesp
        object.Taxonomie.Eigenschaften['Taxonomie ID'] = tax.TaxonomieId
        // save doc and update rev
        const promise = db.saveAsync(object)
          .then((result) => {
            object._res = result.res
            console.log(`The Taxonomy ID of object ${object._id} was updated`)
          })
          .catch(() => console.log(`error saving object ${object}`))
        promises.push(promise)
      } else {
        console.log(`object ${object} did not have object.Taxonomie.Eigenschaften['Taxonomie ID']`)
      }
    } else {
      console.log(`no object found for GUID ${tax.GUID}`)
    }
  })

  return Promise.map(promises, { concurrency: 1 })
}
