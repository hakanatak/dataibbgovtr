let express = require('express');
let garaj = express.Router();
let soap = require('soap');
let proj4 =require('proj4');
let url = 'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl';
let firstProjection = "+proj=tmerc +lat_0=0 +lon_0=30 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs";
let secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
garaj.get('/api/garaj', function(req, res, next) {
  let geojson = {"type" : "FeatureCollection",
    "features" : []
  };
  let args = {};
  soap.createClient(url, function(err, client) {
    client.GetGaraj_json(args, function(err, result) {
      result = JSON.parse(result.GetGaraj_jsonResult);
      result.forEach(function (e) {
            geojson.features.push({
              "type": "Feature",
              "properties": {
                "ID":e.ID,
                "GARAJ_ADI":e.GARAJ_ADI,
                "GARAJ_KODU":e.GARAJ_KODU,
              },
              "geometry": {
                "type": "Point",
                "coordinates": proj4(firstProjection, secondProjection, JSON.parse(e.KOORDINAT.replace("POINT ", "").replace(" ", ",").replace("(", "[").replace(")", "]")))
              }});
          });
      res.send(geojson);
    });
  });
});
let jsonCache;
generateGeojson = (function (geojson) {
  jsonCache = geojson;
  res.send(geojson);
});
module.exports = garaj;