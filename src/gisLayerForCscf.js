'use strict'

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
    Cyclostomi: () => 'Fische',
    Diplopoda: () => 'Tausendfüsser',
    Gastropoda: () => 'Mollusken',
    Insecta: () => getGisLayerByOrdnung(),
    Malacostraca: () => 'Krebse',
    Mammalia: () => 'Saeugetiere',
    Polychaeta: () => 'Wuermer',
    Reptilia: () => 'Reptilien',
  }
  return getGisLayerByKlasse[cscf.Klasse]
}
