/* eslint no-console:0, func-names:0, max-len:0, prefer-arrow-callback:0, quotes:0 */
'use strict'

module.exports = (db, objects) =>
  new Promise((resolve, reject) => {
    const objectsToSave = []

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
        objectsToSave.push(o)
      }
    })

    if (objectsToSave.length === 0) {
      console.log(`0 property collections 'Schutz CH' added`)
      return resolve()
    }
    db.saveAsync(objectsToSave)
      .then(() => {
        console.log(`${objectsToSave.length} property collections 'Schutz CH' added`)
        resolve()
      })
      .catch((error) => {
        console.error('createPcSchutz error:', error)
        reject()
      })
  })
