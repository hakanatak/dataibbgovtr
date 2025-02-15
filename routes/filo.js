let express = require('express');
let filo = express.Router();
let soap = require('soap');

let url = 'https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx?wsdl';

filo.get('/', function (req, res, next) {
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    let args = {};

    soap.createClient(url, function (err, client) {
        if (err) {
            console.error("SOAP Client Creation Error:", err);
            return res.status(500).json({ error: "SOAP servisine bağlanılamadı" });
        }

        client.GetFiloAracKonum_json(args, function (err, result) {
            if (err) {
                console.error("SOAP Request Error:", err);
                return res.status(500).json({ error: "SOAP servisi isteği başarısız" });
            }

            try {
                let data = JSON.parse(result.GetFiloAracKonum_jsonResult);

                data.forEach(function (e) {
                    try {
                        let enlem = parseFloat(e.Enlem.replace(" ", ""));
                        let boylam = parseFloat(e.Boylam.replace(" ", ""));

                        if (isNaN(enlem) || isNaN(boylam)) {
                            console.warn("Geçersiz koordinat atlandı:", e);
                            return;
                        }

                        geojson.features.push({
                            "type": "Feature",
                            "properties": {
                                "Operator": e.Operator || "",
                                "Garaj": e.Garaj || "",
                                "KapiNo": e.KapiNo || "",
                                "Saat": e.Saat || "",
                                "Boylam": e.Boylam || "",
                                "Enlem": e.Enlem || "",
                                "hiz": e.hiz || "",
                                "Plaka": e.Plaka || ""
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [boylam, enlem]
                            }
                        });
                    } catch (parseError) {
                        console.error("Koordinat ayrıştırma hatası:", parseError, e);
                    }
                });

                res.json(geojson);
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError);
                return res.status(500).json({ error: "Geçersiz JSON verisi alındı" });
            }
        });
    });
});

module.exports = filo;
