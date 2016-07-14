/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const async = require('async')
const uuid = require('node-uuid')
const gisLayerForCscf = require('./gisLayerForCscf.js')
const getAgIdEvabByGisLayer = require('./getAgIdEvabByGisLayer.js')

module.exports = (db, objects, cscf) => {
  const q = async.queue(function (newObject, callback) {
    db.save(uuid.v4(), newObject, function (error) {
      // seems like async.series needs this callback
      if (error) console.error('db.save-callback error:', error)
      callback()
    })
  })
  q.drain = function () {
    console.log('new fauna objects added')
  }

  cscf.forEach((cscfO) => {
    const object = objects.find((o) => {
      if (
        o.Taxonomie &&
        o.Taxonomie.Eigenschaften &&
        o.Taxonomie.Eigenschaften['Taxonomie ID']
      ) {
        return cscfO.TaxonomieId === o.Taxonomie.Eigenschaften['Taxonomie ID']
      }
      return false
    })
    if (!object) {
      const gisLayer = gisLayerForCscf(cscfO)
      const newObject = {
        Gruppe: 'Fauna',
        Typ: 'Objekt',
        Taxonomie: {
          Name: 'CSCF (2016)',
          Beschreibung: "Index des CSCF. Eigenschaften von 22'068 Arten",  // eslint-disable-line quotes
          Datenstand: 2016,
          Link: 'http://www.cscf.ch',
          Eigenschaften: {
            'Taxonomie ID': cscfO.TaxonomieId,
          }
        },
        Eigenschaftensammlungen: [
          {
            Name: 'ZH GIS',
            Beschreibung: 'GIS-Layer und Betrachtungsdistanzen für das Artenlistentool, Artengruppen für EvAB, im Kanton Zürich. Eigenschaften aller Arten',
            Datenstand: 'dauernd nachgeführt',
            Link: 'http://www.naturschutz.zh.ch',
            Eigenschaften: {
              'GIS-Layer': gisLayer,
              'Artengruppen-ID in EvAB': getAgIdEvabByGisLayer(gisLayer),
              'Betrachtungsdistanz (m)': 500,
              'Kriterien für Bestimmung der Betrachtungsdistanz': 'Nachträglich durch FNS bestimmt'
            }
          }
        ],
        Beziehungssammlungen: []
      }
      // this object is obsolete
      q.push(newObject, function () {
        // do nothing
      })
    }
  })
}
