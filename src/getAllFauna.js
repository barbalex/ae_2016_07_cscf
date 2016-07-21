'use strict'

/* eslint no-console:0 */

const _ = require('lodash')

module.exports = (db) => {
  console.log('fetching all fauna...')
  return db.viewAsync('artendb/fauna', { include_docs: true })
    .then((result) => {
      let objects = result.map((doc) => doc)
      console.log(`received ${objects.length} fauna-objects`)
      return objects
    })
    .catch((error) => {
      throw error
    })
}
