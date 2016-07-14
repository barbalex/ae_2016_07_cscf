/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

const async = require('async')

module.exports = (db, objects, cscf) => {
  const q = async.queue(function (object, callback) {
    db.save(object._id, object._rev, object, function (error) {
      // seems like async.series needs this callback
      if (error) console.error('db.save-callback error:', error)
      callback()
    })
  })

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
        Artname: `${cscfO.Gattung} ${cscfO.Art}${cscfO.Autor ? ` ${cscfO.Autor}` : ''}`,
        'Artname vollständig': `${cscfO.Gattung} ${cscfO.Art}${cscfO.Autor ? ` ${cscfO.Autor}` : ''}${cscfO.NameDeutsch ? ` (${cscfO.NameDeutsch})` : ''}`,
      }
      const eig = tax.Eigenschaften
      if (cscfO.Unterart) eig.Unterart = cscfO.Unterart
      if (cscfO.Autor) eig.Autor = cscfO.Autor
      if (cscfO.NameDeutsch) eig['Name Deutsch'] = cscfO.NameDeutsch
      if (cscfO.NameFranösisch) eig['Name Französisch'] = cscfO.NameFranösisch
      if (cscfO.NameItalienisch) eig['Name Italienisch'] = cscfO.NameItalienisch

      q.push(object, function () {
        // do nothing
      })
    } else {
      console.error('no object found for cscf:', cscfO)
    }
  })
}
