/* eslint no-console:0 */

'use strict'

const _ = require('lodash')
const couchPass = require('./couchPass.json')
const cradle = require('cradle')
const connection = new (cradle.Connection)('127.0.0.1', 5984, {
  auth: {
    username: couchPass.user,
    password: couchPass.pass
  }
})
const db = connection.database('artendb')
const getFaunaObjects = require('./src/getFaunaObjects.js')
// const rebuildObjects = require('./src/rebuildObjects.js')

let objects = null

getFaunaObjects(db)
  .then((result) => {
    objects = result
    console.log('objects', objects.slice(0, 2))
    console.log('objects.length with Aves', objects.length)
    // filter out Aves
    objects = objects.filter((o) => _.get(o, 'Taxonomie.Eigenschaften.Klasse') !== 'Aves')
    console.log('objects.length without Aves', objects.length)

  })
  // .then(() => rebuildObjects(db, lrTaxonomies))
  .catch((error) => console.log(error))
