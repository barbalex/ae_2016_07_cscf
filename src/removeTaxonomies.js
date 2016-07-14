/* eslint no-console:0, func-names:0, prefer-arrow-callback:0 */
'use strict'

module.exports = (db, objects) =>
  new Promise((resolve, reject) => {
    const objectsToSave = []

    objects.forEach((o) => {
      if (o.Taxonomien) {
        delete o.Taxonomien
        objectsToSave.push(o)
      }
    })

    if (objectsToSave.length === 0) {
      console.log('removed Taxonomien in 0 objects')
      return resolve()
    }
    db.saveAsync(objectsToSave)
      .then(() => {
        console.log(`removed Taxonomien in ${objectsToSave.length} objects`)
        resolve()
      })
      .catch((error) => {
        console.error('removeTaxonomien error:', error)
        reject()
      })
  })
