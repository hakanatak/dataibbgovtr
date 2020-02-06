let express = require('express');
let duyuru = express.Router();
let soap = require('soap');
let url = 'https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl';
duyuru.get('/api/duyuru', function(req, res, next) {
    let args = {};
    soap.createClient(url, function(err, client) {
        client.GetDuyurular_json(args, function(err, result) {
            result = JSON.parse(result.GetDuyurular_jsonResult);
            res.send(result);
        });
    });
});
module.exports = duyuru;