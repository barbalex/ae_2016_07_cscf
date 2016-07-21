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
const cscf = cscfRows.rows
const removeObsoleteObjects = require('./src/removeObsoleteObjects.js')
const getFauna = require('./src/getFauna.js')
const createPcSchutz = require('./src/createPcSchutz.js')
const addNewObjects = require('./src/addNewObjects.js')
const insertNewCscfProperties = require('./src/insertNewCscfProperties.js')
const updateCscf2009 = require('./src/updateCscf2009.js')


getFauna(db)
  .then((objects) => updateNuesp(db, objects))
  .then(() => getFauna(db))
  .then((objects) => removeObsoleteObjects(db, objects, cscf))
  .then(() => getFauna(db))
  .then((objects) => createPcSchutz(db, objects))
  .then(() => getFauna(db))
  .then((objects) => addNewObjects(db, objects, cscf))
  .then(() => getFauna(db))
  .then((objects) => insertNewCscfProperties(db, objects, cscf))
  .then(() => getFauna(db))
  .then((objects) => updateCscf2009(db, objects))
  .then(() => getFauna(db))
  .then(() => {
    console.log('new CSCF-Taxonomy applied!')
  })
  .catch((error) => console.log('index.js error:', error))
