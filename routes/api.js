var express = require('express');
var router = express.Router();

const controller = require('../controller/controller.api');

router.get('/validID', controller.getValidID);

router.post('/project/invite', controller.postInviteProject);

router.post('/searchProfile', controller.postGetUserListWith);


module.exports = router;