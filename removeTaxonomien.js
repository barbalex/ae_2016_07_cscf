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
const getObjects = require('./src/getObjects.js')
const removeTaxonomien = require('./src/removeTaxonomien.js')


getObjects(db)
  .then((objects) => removeTaxonomien(db, objects))
  .then(() => {
    console.log('done')
  })
  .catch((error) => console.log(error))
