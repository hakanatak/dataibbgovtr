let express = require('express');
let garaj = express.Router();
let soap = require('soap');
// Proj4 kütüphanesi artık kullanılmayacak çünkü dönüşüme gerek yok
// let proj4 = require('proj4');

let url = 'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl';

garaj.get('/', function (req, res, next) {
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

    client.GetGaraj_json(args, function (err, result) {
      if (err) {
        console.error("SOAP Request Error:", err);
        return res.status(500).json({ error: "SOAP isteği başarısız" });
      }

      try {
        let data = JSON.parse(result.GetGaraj_jsonResult);

        data.forEach(function (e) {
          try {
          
            let coordsOnly = e.KOORDINAT.replace(/^POINT\s*\(/, '').replace(/\)$/, '');
            let koordinat = coordsOnly.trim().split(/\s+/).map(Number);

            if (!Array.isArray(koordinat) || koordinat.length !== 2 || koordinat.some(isNaN)) {
              console.warn("Geçersiz koordinat atlandı:", e);
              return;
            }

            // API zaten WGS84 (derece) formatında koordinat veriyor dönüşüme gerek yok.
            let convertedCoord = koordinat;
            geojson.features.push({
              "type": "Feature",
              "properties": {
                "ID": e.ID || "",
                "GARAJ_ADI": e.GARAJ_ADI || "",
                "GARAJ_KODU": e.GARAJ_KODU || ""
              },
              "geometry": {
                "type": "Point",
                "coordinates": convertedCoord
              }
            });
          } catch (parseError) {
            console.error("Koordinat işleme hatası:", parseError, e);
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

module.exports = garaj;
