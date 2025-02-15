let express = require('express');
let duyuru = express.Router();
let soap = require('soap');

let url = 'https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl';

duyuru.get('/', function(req, res, next) {
    let args = {};

    soap.createClient(url, function(err, client) {
        if (err) {
            console.error("SOAP Client Creation Error:", err);
            return res.status(500).json({ error: "SOAP servisine bağlanılamadı" });
        }

        client.GetDuyurular_json(args, function(err, result) {
            if (err) {
                console.error("SOAP Request Error:", err);
                return res.status(500).json({ error: "SOAP servisi isteği başarısız" });
            }

            try {
                result = JSON.parse(result.GetDuyurular_jsonResult);
                res.send(result);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return res.status(500).json({ error: "Geçersiz JSON verisi alındı" });
            }
        });
    });
});

module.exports = duyuru;
