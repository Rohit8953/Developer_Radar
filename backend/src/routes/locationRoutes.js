const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.patch('/me/location', locationController.updateLocation);
router.get('/nearby', locationController.getNearbyDevelopers);

module.exports = router;