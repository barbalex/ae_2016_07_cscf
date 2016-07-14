/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const uuid = require('node-uuid')
const gisLayerForCscf = require('./gisLayerForCscf.js')
const getAgIdEvabByGisLayer = require('./getAgIdEvabByGisLayer.js')

module.exports = (db, objects, cscf) =>
  new Promise((resolve, reject) => {
    const objectsToSave = []

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
          _id: uuid.v4(),
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
        objectsToSave.push(newObject)
      }
    })

    if (objectsToSave.length === 0) {
      console.log('0 new fauna objects added')
      return resolve()
    }
    db.saveAsync(objectsToSave)
      .then(() => {
        console.log(`${objectsToSave.length} new fauna objects added`)
        resolve()
      })
      .catch((error) => {
        console.error('addNewObjects error:', error)
        reject()
      })
  })
