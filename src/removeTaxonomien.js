/* eslint no-console:0, func-names:0, prefer-arrow-callback:0 */
'use strict'

const async = require('async')

module.exports = (db, objects) => {
  const callbacks = []
  objects.forEach((o) => {
    if (o.Taxonomien) {
      delete o.Taxonomien
      const callback = db.save(o._id, o._rev, o, function () {
        // seems that async needs this callback
      })
      callbacks.push(callback)
    }
  })

  if (callbacks.length === 0) return console.log(`Taxonomien removed in ${callbacks.length} objects`)
  async.series(callbacks, function (err) {
    if (err) return console.log('removeTaxonomien.js Error:', err)
    return console.log(`Taxonomien removed in ${callbacks.length} objects`)
  })
}
