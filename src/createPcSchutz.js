/* eslint no-console:0, func-names:0, max-len:0, prefer-arrow-callback:0, quotes:0 */
'use strict'

const async = require('async')

module.exports = (db, objects) => {
  const q = async.queue(function (o, callback) {
    db.save(o._id, o._rev, o, function (error) {
      if (error) console.error('db.save-callback error:', error)
      callback()
    })
  })
  q.drain = function () {
    console.log(`property collections 'Schutz CH' added`)
  }

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

      q.push(o, function () {
        // do nothing
      })
    }
  })
}
