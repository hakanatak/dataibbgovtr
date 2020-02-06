let express = require('express');
let durak = express.Router();
let soap = require('soap');
let url = 'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl';
durak.get('/api/durak', function(req, res, next) {
    let geojson = {"type" : "FeatureCollection",
        "features" : []
    };
    let args = {DurakKodu:''};
    soap.createClient(url, function(err, client) {
        client.GetDurak_json(args, function(err, result) {
            result = JSON.parse(result.GetDurak_jsonResult);
            durak =
                result.forEach(function (e) {
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {
                            "SDURAKKODU":e.SDURAKKODU,
                            "SDURAKADI":e.SDURAKADI,
                            "ILCEADI":e.ILCEADI,
                            "SYON":e.SYON,
                            "AKILLI":e.AKILLI,
                            "FIZIKI":e.FIZIKI,
                            "DURAK_TIPI":e.DURAK_TIPI,
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
module.exports = durak;