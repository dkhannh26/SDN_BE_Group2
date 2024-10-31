const express = require('express');
const { getStatistic } = require('../controllers/statistic.controller');
const statisticRouter = express.Router()

statisticRouter.get('/:year', getStatistic)

module.exports = statisticRouter;