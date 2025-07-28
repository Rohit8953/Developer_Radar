// const express = require('express');
// const router = express.Router();
// const connectionController = require('../controllers/conn');
// const authController = require('../controllers/authController');

// // Protect all routes
// router.use(authController.protect);

// router.get('/', connectionController.getAllConnections);
// router.get('/pending', connectionController.getPendingConnections);
// router.get('/suggestions', connectionController.getConnectionSuggestions);

// router.post('/:userId', connectionController.sendConnectionRequest);
// router.patch('/:requestId', connectionController.respondToConnectionRequest);
// router.delete('/:connectionId', connectionController.removeConnection);

// module.exports = router;