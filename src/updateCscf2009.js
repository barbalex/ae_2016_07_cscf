/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const _ = require('lodash')

module.exports = (db, objects) =>
  new Promise((resolve, reject) => {
    const objectsToSave = []

    objects.forEach((o) => {
      if (_.get(o, 'Taxonomie.Name') === 'CSCF (2009)') {
        if (
          o.Taxonomie.Eigenschaften &&
          o.Taxonomie.Eigenschaften['Taxonomie ID'] &&
          o.Taxonomie.Eigenschaften['Taxonomie ID'] > 1000000
        ) {
          o.Taxonomie.Name = 'CSCF (2016)'
          o.Taxonomie.Beschreibung = `Diese Art (und alle mit einer Taxonomie ID > 1'000'000) wurde von der Fachstelle Naturschutz des Kantons Zürich ergänzt`
          o.Taxonomie.Datenstand = 2016
          o.Taxonomie.Link = 'http://naturschutz.zh.ch'
          objectsToSave.push(o)
        } else if (_.get(o, 'Taxonomie.Eigenschaften.Klasse') === 'Aves') {
          o.Taxonomie.Name = 'CSCF (2016)'
          o.Taxonomie.Beschreibung = 'Die taxonomischen Daten der Vögel stammen noch aus dem Jahr 2009'
          o.Taxonomie.Datenstand = 2009
          o.Taxonomie.Link = 'http://www.cscf.ch'
          objectsToSave.push(o)
        } else {
          o.Taxonomie.Name = 'CSCF (2016)'
          o.Taxonomie.Beschreibung = 'Die Taxonomie dieser Art stammt noch aus dem Jahr 2009'
          o.Taxonomie.Datenstand = 2009
          o.Taxonomie.Link = 'http://www.cscf.ch'
          objectsToSave.push(o)
        }
      }
    })

    if (objectsToSave.length === 0) {
      console.log('0 objects updated')
      return resolve()
    }
    db.saveAsync(objectsToSave)
      .then((result) => {
        console.log(`${objectsToSave.length} objects updated, result:`, result)
        console.log(`objectsToSave[0]:`, objectsToSave[0])
        resolve()
      })
      .catch((error) => {
        console.error('insertNewCscfProperties error:', error)
        reject()
      })
  })
