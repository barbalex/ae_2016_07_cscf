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
// const rebuildObjects = require('./src/rebuildObjects.js')

let objects = null

db.viewAsync('artendb/fauna', { include_docs: true })
  .then((result) => {
    objects = result.map((doc) => doc)
    // filter out Aves
    objects = objects.filter((o) => _.get(o, 'Taxonomie.Eigenschaften.Klasse') !== 'Aves')
    return updateNuesp(db, objects)
  })
  .then(() => {
    console.log('done')
  })
  // .then(() => rebuildObjects(db, lrTaxonomies))
  .catch((error) => console.log(error))
