/* eslint no-console:0, max-len:0, prefer-arrow-callback:0, func-names:0 */
'use strict'

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

        objectsToSave.push(object)
      } else {
        console.error('no object found for cscf:', cscfO)
      }
    })

    if (objectsToSave.length === 0) {
      console.log('0 new cscf properties inserted')
      return resolve()
    }
    db.saveAsync(objectsToSave)
      .then(() => {
        console.log(`${objectsToSave.length} new cscf properties inserted`)
        resolve()
      })
      .catch((error) => {
        console.error('insertNewCscfProperties error:', error)
        reject()
      })
  })
