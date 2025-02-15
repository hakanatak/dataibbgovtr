let express = require('express');
let durak = express.Router();
let soap = require('soap');

let url = 'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl';

durak.get('/', function(req, res, next) {
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };
    let args = { DurakKodu: '' };

    soap.createClient(url, function(err, client) {
        if (err) {
            console.error("SOAP Client Creation Error:", err);
            return res.status(500).json({ error: "SOAP servisine bağlanılamadı" });
        }

        client.GetDurak_json(args, function(err, result) {
            if (err) {
                console.error("SOAP Request Error:", err);
                return res.status(500).json({ error: "SOAP servisi isteği başarısız" });
            }

            try {
                result = JSON.parse(result.GetDurak_jsonResult);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return res.status(500).json({ error: "Geçersiz JSON verisi alındı" });
            }

            result.forEach(function(e) {
                geojson.features.push({
                    "type": "Feature",
                    "properties": {
                        "SDURAKKODU": e.SDURAKKODU,
                        "SDURAKADI": e.SDURAKADI,
                        "ILCEADI": e.ILCEADI,
                        "SYON": e.SYON,
                        "AKILLI": e.AKILLI,
                        "FIZIKI": e.FIZIKI,
                        "DURAK_TIPI": e.DURAK_TIPI,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": JSON.parse(e.KOORDINAT.replace("POINT ", "").replace(" ", ",").replace("(", "[").replace(")", "]"))
                    }
                });
            });

            res.send(geojson);
        });
    });
});

module.exports = durak;
