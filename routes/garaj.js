let express = require('express');
let garaj = express.Router();
let soap = require('soap');
let url = 'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl';
garaj.get('/api/garaj', function(req, res, next) {
  let geojson = {"type" : "FeatureCollection",
    "features" : []
  };
  let args = {};
  soap.createClient(url, function(err, client) {
    client.GetGaraj_json(args, function(err, result) {
      result = JSON.parse(result.GetGaraj_jsonResult);
      data =
          result.forEach(function (e) {
            geojson.features.push({
              "type": "Feature",
              "properties": {
                "ID":e.ID,
                "GARAJ_ADI":e.GARAJ_ADI,
                "GARAJ_KODU":e.GARAJ_KODU,
              },
              "geometry": {
                "type":"Point",
                "coordinates": JSON.parse(e.KOORDINAT.replace("POINT ", "").replace(" ", ",").replace("(","[").replace(")","]"))
              }
            });
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