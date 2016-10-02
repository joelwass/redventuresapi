var express = require('express');
var router = express.Router();
var controllers = require('../api/controllers');
var middleware = require('./middleware');

/* GET home page. */
router.get('/', function(req, res, next) { res.render('index', { title: 'Express' }); });

router.get('/state/:state/cities', controllers.state.getAllCities);

router.get('/user/:user/visits/states', middleware.requireAuthentication, controllers.visit.getStatesVisited);

router.delete('/user/:user/visit/:visit', middleware.requireAuthentication, controllers.visit.deleteVisit);

router.route('/user/:user/visits')
    .post(middleware.requireAuthentication, controllers.visit.createVisit)
    .get(middleware.requireAuthentication, controllers.visit.getCitiesVisited);

router.route('/user')
    .get(controllers.user.login)
    .post(controllers.user.createUser)
    .delete(controllers.user.deleteUser);

module.exports = router;
