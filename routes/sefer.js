let express = require('express');
let sefer = express.Router();
let soap = require('soap');
let url = 'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl';

sefer.get('/', function (req, res, next) {
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    let args = { DurakKodu: '' };

    soap.createClient(url, function (err, client) {
        if (err) {
            console.error("SOAP Client Creation Error:", err);
            return res.status(500).json({ error: "SOAP servisine bağlanılamadı" });
        }

        client.GetDurak_json(args, function (err, result) {
            if (err) {
                console.error("SOAP Request Error:", err);
                return res.status(500).json({ error: "SOAP isteği başarısız" });
            }

            try {
                let data = JSON.parse(result.GetDurak_jsonResult);

                data.forEach(function (e) {
                    try {
                        let koordinatStr = e.KOORDINAT.replace("POINT ", "").replace(" ", ",").replace("(", "[").replace(")", "]");
                        let koordinat = JSON.parse(koordinatStr);

                        if (!Array.isArray(koordinat) || koordinat.length !== 2) {
                            console.warn("Geçersiz koordinat atlandı:", e);
                            return;
                        }

                        geojson.features.push({
                            "type": "Feature",
                            "properties": {
                                "SDURAKKODU": e.SDURAKKODU || "",
                                "SDURAKADI": e.SDURAKADI || "",
                                "ILCEADI": e.ILCEADI || "",
                                "SYON": e.SYON || "",
                                "AKILLI": e.AKILLI || "",
                                "FIZIKI": e.FIZIKI || "",
                                "DURAK_TIPI": e.DURAK_TIPI || ""
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": koordinat
                            }
                        });
                    } catch (parseError) {
                        console.error("Koordinat dönüştürme hatası:", parseError, e);
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

module.exports = sefer;
