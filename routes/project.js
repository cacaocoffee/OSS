var express = require('express');
var router = express.Router();
const controller = require('../controller/controller.project');

router.get('/my', controller.getMyProject);

router.get('/detail', controller.getProejctDetail);

router.get('/list', controller.getProject);

router.get('/make', controller.getProjectMake);

router.post('/make', controller.postProjectMake);

router.use(controller.getProject);

module.exports = router;
