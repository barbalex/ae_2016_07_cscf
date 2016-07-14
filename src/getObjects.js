'use strict'

/* eslint no-console:0 */

module.exports = (db) => {
  console.log('fetching fauna...')
  return db.viewAsync('artendb/objekte', { include_docs: true })
    .then((result) => {
      const objects = result.map((doc) => doc)
      console.log(`received ${objects.length} objects`)
      return objects
    })
    .catch((error) => {
      throw error
    })
}
