/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const async = require('async')
const uuid = require('node-uuid')
const gisLayerForCscf = require('./gisLayerForCscf.js')
const getAgIdEvabByGisLayer = require('./getAgIdEvabByGisLayer.js')

module.exports = (db, objects, cscf) => {
  const callbacks = []
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
            Klasse: cscfO.Klasse,
            Ordnung: cscfO.Ordnung,
            Familie: cscfO.Familie,
            Gattung: cscfO.Gattung,
            Art: cscfO.Art,
            Unterart: cscfO.Unterart,
            Autor: cscfO.Autor,
            Artname: `${cscfO.Gattung} ${cscfO.Art}${cscfO.Autor ? ` ${cscfO.Autor}` : ''}`,
            'Artname vollständig': `${cscfO.Gattung} ${cscfO.Art}${cscfO.Autor ? ` ${cscfO.Autor}` : ''}${cscfO.NameDeutsch ? ` (${cscfO.NameDeutsch})` : ''}`,
            'Name Deutsch': cscfO.NameDeutsch,
            'Name Französisch': cscfO.NameFranösisch,
            'Name Italienisch': cscfO.NameItalienisch,
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
      const callback = db.save(uuid.v4(), newObject, function () {
        // seems like async.series needs this callback
      })
      callbacks.push(callback)
    }
  })

  if (callbacks.length === 0) return console.log(`${callbacks.length} new fauna objects added`)
  async.series(callbacks, function (err) {
    if (err) return console.log('addNewObjects.js Error:', err)
    console.log(`${callbacks.length} new fauna objects added`)
  })
}
