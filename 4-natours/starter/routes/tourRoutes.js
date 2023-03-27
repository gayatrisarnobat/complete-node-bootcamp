const express = require('express');
const tourController = require('../controllers/tour-controller');

const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourController;

const router = express.Router();

// router.param('id', checkID); // Param middleware check

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
