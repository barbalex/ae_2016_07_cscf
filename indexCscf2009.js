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
const getAllFauna = require('./src/getAllFauna.js')
const updateCscf2009 = require('./src/updateCscf2009.js')

getAllFauna(db)
  .then((objects) => updateCscf2009(db, objects))
  .then(() => getAllFauna(db))
  .then(() => {
    console.log('done!')
  })
  .catch((error) => console.log('index.js error:', error))
