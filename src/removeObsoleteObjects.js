/* eslint no-console:0, func-names:0, prefer-arrow-callback:0 */
'use strict'

const idsToKeep = require('./idsToKeep.js')

module.exports = (db, objects, cscf) =>
  new Promise((resolve, reject) => {
    const objectsToDelete = []
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
        o._deleted = true // eslint-disable-line no-underscore-dangle
        objectsToDelete.push(o)
      }
    })

    if (objectsToDelete.length === 0) {
      console.log('0 obsolete objects removed')
      return resolve()
    }
    db.saveAsync(objectsToDelete)
      .then(() => {
        console.log(`${objectsToDelete.length} obsolete objects removed`)
        resolve()
      })
      .catch((error) => {
        console.error('removeObsoleteObjects error:', error)
        reject()
      })
  })
