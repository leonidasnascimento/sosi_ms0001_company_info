var express = require('express');
var router = express.Router();
var HttpStatus = require('http-status-codes');
var comp_dao = require('../data/dal_campany_info');
var cacheDb = require('sosi_cache_db_manager')
var cacheDbKey_DividendAnalysis = 'sosi_ms0001_company_info.dividend_analysis'

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

/* **********************************
  DIVIDEND ANALYSIS ENDPOINT SECTION
************************************* */

router.put('/dividend_analysis', function (req, res, next) {
  var cacheDbMngr = new cacheDb(cacheDbKey_DividendAnalysis)
  var dao = new comp_dao()

  dao.get_dividend_analysis_data(function (data) {
    cacheDbMngr.setValue(data, function (obj) {
      res.status(HttpStatus.OK).send(obj)
    }, function (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
    })
  }, function (data) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
  })
});

router.get('/dividend_analysis', function (req, res, next) {
  var cacheDbMngr = new cacheDb(cacheDbKey_DividendAnalysis)

  //Trying to get data from Redis
  cacheDbMngr.getValue(function (obj) {
    if (obj.data !== null) {
      res.status(HttpStatus.OK).send(JSON.parse(obj.data));
    } else {
      //Going to main db to retrieve the data if some error occurr when getting from Redis
      new comp_dao()
        .get_dividend_analysis_data(function (data) {
          res.status(HttpStatus.OK).send(data);
        }, function (data) {
          res.status(HttpStatus.METHOD_FAILURE).send(data);
        });
    }
  }, function (obj) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(obj);
  })
});

module.exports = router;