'use strict'

/* eslint no-console:0 */

module.exports = (cscf) => {
  // only used for Ordnung Coleoptera
  const getGisLayerByFamilieForColeoptera = () => {
    switch (cscf.Familie) {
      case 'Carabidae':
        return 'Laufkaefer'
      default:
        return 'Kaefer'
    }
  }
  // only used for Ordnung Lepidoptera
  const getGisLayerByFamilieForLepidoptera = () => {
    switch (cscf.Familie) {
      case 'Hesperiidae':
      case 'Lycaenidae':
      case 'Nymphalidae':
      case 'Papilionidae':
      case 'Pieridae':
      case 'Zygaenidae':
        return 'Tagfalter'
      default:
        return 'Nachtfalter'
    }
  }
  // only used for Klasse insecta
  const getGisLayerByOrdnung = () => {
    const lbO = {
      Coleoptera: getGisLayerByFamilieForColeoptera(),
      Dermaptera: 'Übrige Insekten',
      Dictyoptera: 'Heuschrecken',
      Diptera: 'Zweifluegler',
      Ephemeroptera: 'Eintagsfliegen',
      Hemiptera: 'Zikaden',
      Heteroptera: 'Wanzen',
      Hymenoptera: 'Hautfluegler',
      Lepidoptera: getGisLayerByFamilieForLepidoptera(),
      Odonata: 'Libellen',
      Orthoptera: 'Heuschrecken',
      Planipennia: 'Netzfluegler',
      Plecoptera: 'Steinfliegen',
      Trichoptera: 'Koecherfliegen',
    }
    return lbO[cscf.Ordnung]
  }
  const getGisLayerByKlasse = {
    Actinopterygii: () => 'Fische',
    Amphibia: () => 'Amphibien',
    Arachnida: () => 'Spinnen',
    Aves: () => 'Voegel',
    Bivalvia: () => 'Mollusken',
    Cephalaspidomorphi: () => 'Fische',
    Cyclostomi: () => 'Fische',
    Diplopoda: () => 'Tausendfüsser',
    Gastropoda: () => 'Mollusken',
    Insecta: () => getGisLayerByOrdnung(),
    Malacostraca: () => 'Krebse',
    Mammalia: () => 'Saeugetiere',
    Polychaeta: () => 'Wuermer',
    Reptilia: () => 'Reptilien',
  }
  const gisLayer = getGisLayerByKlasse[cscf.Klasse]()
  if (!gisLayer) console.log('no gisLayer found for cscf:', cscf)
  return gisLayer
}
