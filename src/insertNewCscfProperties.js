/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const async = require('async')

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
    if (object && object.Taxonomie) {
      const tax = object.Taxonomie
      tax.Name = 'CSCF (2016)'
      tax.Beschreibung = "Index des CSCF. Eigenschaften von 22'068 Arten"  // eslint-disable-line quotes
      tax.Datenstand = 2016
      tax.Link = 'http://www.cscf.ch'
      tax.Eigenschaften = {
        'Taxonomie ID': cscfO.TaxonomieId,
        'Taxon ID VDC': `infospecies.ch:infofauna:${cscfO.TaxonomieId}`,
        Klasse: cscfO.Klasse || '',
        Ordnung: cscfO.Ordnung || '',
        Familie: cscfO.Familie || '',
        Gattung: cscfO.Gattung || '',
        Art: cscfO.Art || '',
        Unterart: cscfO.Unterart || '',
        Autor: cscfO.Autor || '',
        Artname: `${cscfO.Gattung} ${cscfO.Art}${cscfO.Autor ? ` ${cscfO.Autor}` : ''}`,
        'Artname vollständig': `${cscfO.Gattung} ${cscfO.Art}${cscfO.Autor ? ` ${cscfO.Autor}` : ''}${cscfO.NameDeutsch ? ` (${cscfO.NameDeutsch})` : ''}`,
        'Name Deutsch': cscfO.NameDeutsch || '',
        'Name Französisch': cscfO.NameFranösisch || '',
        'Name Italienisch': cscfO.NameItalienisch || '',
      }
      // this object is obsolete
      const callback = db.save(object._id, object._rev, object, function () {
        // seems like async.series needs this callback
      })
      callbacks.push(callback)
    } else {
      console.log('no object found for cscf:', cscfO)
    }
  })

  if (callbacks.length === 0) return console.log(`taxonomy updated in ${callbacks.length} fauna objects`)
  async.series(callbacks, function (err) {
    if (err) return console.log('insertNewCscfProperties.js Error:', err)
    return console.log(`taxonomy updated in ${callbacks.length} fauna objects`)
  })
}
