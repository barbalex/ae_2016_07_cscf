/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const _ = require('lodash')

module.exports = (db, objects) =>
  new Promise((resolve, reject) => {
    const objectsToSave = []

    objects.forEach((o) => {
      if (_.get(o, 'Taxonomie.Name') === 'CSCF (2009)') {
        o.Name = 'CSCF (2016)'
        if (
          o.Taxonomie.Eigenschaften &&
          o.Taxonomie.Eigenschaften['Taxonomie ID'] &&
          o.Taxonomie.Eigenschaften['Taxonomie ID'] > 1000000
        ) {
          o.Beschreibung = `Diese Art (und alle mit einer Taxonomie ID > 1'000'000) wurde von der Fachstelle Naturschutz des Kantons Zürich ergänzt`
          o.Datenstand = 2016
          o.Link = 'http://naturschutz.zh.ch'
        }
        if (_.get(o, 'Taxonomie.Eigenschaften.Klasse') === 'Aves') {
          o.Beschreibung = 'Die taxonomischen Daten der Vögel stammen noch aus dem Jahr 2009'
          o.Datenstand = 2009
          o.Link = 'http://www.cscf.ch'
        }
        objectsToSave.push(o)
      }
    })

    if (objectsToSave.length === 0) {
      console.log('0 objects updated')
      return resolve()
    }
    db.saveAsync(objectsToSave)
      .then(() => {
        console.log(`${objectsToSave.length} objects updated`)
        resolve()
      })
      .catch((error) => {
        console.error('insertNewCscfProperties error:', error)
        reject()
      })
  })
