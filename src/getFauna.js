'use strict'

const _ = require('lodash')

module.exports = (db) => {
  console.log('fetching fauna...')
  return db.viewAsync('artendb/fauna', { include_docs: true })
    .then((result) => {
      let objects = result.map((doc) => doc)
      // filter out Aves
      objects = objects.filter((o) => _.get(o, 'Taxonomie.Eigenschaften.Klasse') !== 'Aves')
      console.log(`received ${objects.length} fauna-objects`)
      return objects
    })
    .catch((error) => {
      throw error
    })
}
