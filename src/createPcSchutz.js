/* eslint no-console:0 */
'use strict'

const async = require('async')

module.exports = (db, objects) => {
  const callbacks = []
  objects.forEach((o) => {
    if (
      (
        o.Taxonomie &&
        o.Taxonomie.Eigenschaften &&
        o.Taxonomie.Eigenschaften['Schutz CH']
      )
    ) {
      // create new property collection
      const pc = {
        Name: 'Schutz CH (2009)',
        Beschreibung: 'Schutzstatus, wie er in einer Datenlieferung des CSCF aus dem Jahr 2009 enthalten war',
        Datenstand: 2009,
        'importiert von': 'alex@gabriel-software.ch',
        Eigenschaften: {
          'Schutz CH': o.Taxonomie.Eigenschaften['Schutz CH']
        },
        Nutzungsbedingungen: 'Importiert mit Einverständnis des Autors. Eine allfällige Weiterverbreitung ist nur mit dessen Zustimmung möglich.'
      }
      o.Eigenschaftensammlungen.push(pc)
      delete o.Taxonomie.Eigenschaften['Schutz CH']
      const callback = db.save(o._id, o._rev, o, () => {
        // do nothing
        // seems like this callback is needed
      })
      callbacks.push(callback)
    }
  })

  async.series(callbacks, function (err) {
    if (err) return console.log('createPcSchutz.js Error:', err)
    return console.log(`${callbacks.length} property collections 'Schutz CH' added`)
  })
}
