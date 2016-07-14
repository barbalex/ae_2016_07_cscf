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
const getGroup = require('./src/getGroup.js')
const removeTaxonomies = require('./src/removeTaxonomies.js')


getGroup(db, 'fauna')
  .then((objects) => removeTaxonomies(db, objects))
  .then(() => getGroup(db, 'flora'))
  .then((objects) => removeTaxonomies(db, objects))
  .then(() => getGroup(db, 'moose'))
  .then((objects) => removeTaxonomies(db, objects))
  .then(() => getGroup(db, 'macromycetes'))
  .then((objects) => removeTaxonomies(db, objects))
  .then(() => getGroup(db, 'lr'))
  .then((objects) => removeTaxonomies(db, objects))
  .then(() => {
    console.log('done')
  })
  .catch((error) => console.log(error))
