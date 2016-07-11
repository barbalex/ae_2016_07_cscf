/* eslint no-console:0 */

'use strict'

const Promise = require('bluebird')
const taxIdsNew = require('./taxIdNew.js')

module.exports = (db, objects) =>
  new Promise((resolve) => {
    const promises = taxIdsNew.map((tax) =>
      new Promise((resolve2) => {
        // find object
        const object = objects.find((o) => o._id === tax.GUID)
        if (object) {
          if (object.Taxonomie && object.Taxonomie.Eigenschaften && object.Taxonomie.Eigenschaften['Taxonomie ID']) {
            // update nuesp
            object.Taxonomie.Eigenschaften['Taxonomie ID'] = tax.TaxonomieId
            // save doc and update rev
            db.saveAsync(object)
            .then((result) => {
              object._res = result.res
              console.log(`The Taxonomy ID of object ${object._id} was updated`)
              resolve2(true)
            })
            .catch((error) => console.log(`error saving object ${object}`))
          } else {
            console.log(`object ${object} did not have object.Taxonomie.Eigenschaften['Taxonomie ID']`)
            resolve2(true)
          }
        } else {
          console.log(`no object found for GUID ${tax.GUID}`)
          resolve2(true)
        }
      })
    )

    Promise.map(promises, { concurrency: 1 })
    .then(() => resolve(true))
  })
