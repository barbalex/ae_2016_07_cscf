'use strict'

/* eslint no-console:0 */

const agIdEvabByGisLayer = require('./agIdEvabByGisLayer.js')

module.exports = (gisLayer) => {
  const dataset = agIdEvabByGisLayer.find((o) => o['GIS-Layer'] === gisLayer)
  if (!dataset) {
    console.log('found no dataset in agIdEvabByGisLayer for gisLayer:', gisLayer)
    return null
  }
  const agIdEvab = dataset['Artengruppen-ID in EvAB']
  if (!agIdEvab) {
    console.log('found no agIdEvab in agIdEvabByGisLayer for gisLayer:', gisLayer)
    return null
  }
  return agIdEvab
}
