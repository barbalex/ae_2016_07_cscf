'use strict'

/* eslint no-console:0 */

module.exports = (db, group) => {
  console.log('fetching objects...')
  return db.viewAsync(`artendb/${group}`, { include_docs: true })
    .then((result) => {
      const objects = result.map((doc) => doc)
      console.log(`received ${objects.length} objects from group ${group}`)
      return objects
    })
    .catch((error) => {
      throw error
    })
}
