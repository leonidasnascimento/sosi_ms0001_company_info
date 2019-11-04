var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');
var comp_dao = require('../data/dal_campany_info');

/* GET home page. */
router.get('/cnpj/', function (req, res, next) {
  if (Object.keys(req.query).length === 0) {
    res.status(HttpStatus.LENGTH_REQUIRED).send({
      "message": "CNPJ is required!"
    });
  }

  new comp_dao()
    .get_company_info_cnpj(req.query['cnpj'], function (data) {
      res.status(HttpStatus.OK).send(data);
    }, function (data) {
      res.status(HttpStatus.METHOD_FAILURE).send(data);
    });
});

/* POST Company Info */
router.post('/', function (req, res, next) {
  new comp_dao()
    .add_company_info(req.body, function (data) {
      res.status(HttpStatus.OK).send(data);
    }, function (data) {
      res.status(HttpStatus.METHOD_FAILURE).send(data);
    });
});

module.exports = router;