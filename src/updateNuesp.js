/* eslint no-console:0 */

'use strict'

const Promise = require('bluebird')
const taxIdsToUpdate = require('./taxIdsToUpdate.js')

module.exports = (db, objects) => {
  const promises = []
  taxIdsToUpdate.forEach((tax) => {
    // find object
    const object = objects.find((o) => o._id === tax.GUID)
    if (object) {
      if (
        object.Taxonomie &&
        object.Taxonomie.Eigenschaften &&
        object.Taxonomie.Eigenschaften['Taxonomie ID']
      ) {
        // update nuesp
        object.Taxonomie.Eigenschaften['Taxonomie ID'] = tax.TaxonomieId
        // save doc
        const promise = db.saveAsync(object)
          .then(() => console.log(`The Taxonomy ID of object ${object._id} was updated`))
          .catch(() => console.log(`error saving object ${object}`))
        promises.push(promise)
      } else {
        console.log(`object ${object} did not have object.Taxonomie.Eigenschaften['Taxonomie ID']`)
      }
    } else {
      console.log(`no object found for GUID ${tax.GUID}`)
    }
  })

  return Promise.all(promises)
}
