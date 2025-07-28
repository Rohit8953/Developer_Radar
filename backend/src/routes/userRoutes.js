const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
// Public routes
// router.post('/signup', userController.signup);
// router.post('/login', userController.login);

// All routes after this middleware are protected
// router.use(protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

// Admin-only routes
// router.use(restrictTo('admin'));

router.get('/userdetails', userController.getAllUsers)
router.post('createuser' ,userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;