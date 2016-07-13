/* eslint no-console:0 */

'use strict'

const Promise = require('bluebird')
const cradle = Promise.promisifyAll(require('cradle'))
const couchPass = require('./couchPass.json')
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
const getFauna = require('./src/getFauna.js')
const createPcSchutz = require('./src/createPcSchutz.js')
const addNewObjects = require('./src/addNewObjects.js')

const cscf = cscfRows.rows

getFauna(db)
  .then((objects) => updateNuesp(db, objects))
  .then(() => getFauna(db))
  .then((objects) => removeObsoleteObjects(db, objects, cscf))
  .then(() => getFauna(db))
  .then((objects) => createPcSchutz(db, objects))
  .then(() => getFauna(db))
  .then((objects) => addNewObjects(db, objects, cscf))
  .then(() => {
    console.log('done')
  })
  .catch((error) => console.log(error))
