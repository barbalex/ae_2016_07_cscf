/* eslint no-console:0 */

'use strict'

const _ = require('lodash')
const Promise = require('bluebird')
const couchPass = require('./couchPass.json')
const cradle = Promise.promisifyAll(require('cradle'))
const connection = new (cradle.Connection)('127.0.0.1', 5984, {
  auth: {
    username: couchPass.user,
    password: couchPass.pass
  }
})
const db = connection.database('artendb')
const updateNuesp = require('./src/updateNuesp.js')
const cscfRows = require('./src/import.json')
const removeObsoleteObjects = require('./src/removeObsoleteObjects.js')
// const rebuildObjects = require('./src/rebuildObjects.js')

let objects = null
const cscf = cscfRows.rows
console.log('cscf[0]:', cscf[0])

db.viewAsync('artendb/fauna', { include_docs: true })
  .then((result) => {
    objects = result.map((doc) => doc)
    // filter out Aves
    objects = objects.filter((o) => _.get(o, 'Taxonomie.Eigenschaften.Klasse') !== 'Aves')
    console.log('objects.length before removing obsolete:', objects.length)
    return updateNuesp(db, objects)
  })
  .then(() => removeObsoleteObjects(db, objects, cscf))
  .then(() => {
    console.log('objects.length after removing obsolete:', objects.length)
    console.log('done')
  })
  // .then(() => rebuildObjects(db, lrTaxonomies))
  .catch((error) => console.log(error))
