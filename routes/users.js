const router = require('express').Router();

const { validateProfileUpdate, validateAvatarUpdate } = require('../middlewares/validators');

const {
  getUsers,
  currentUserInfo,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', currentUserInfo);
router.get('/:userId', getUserById);
router.patch('/me', validateProfileUpdate, updateProfile);
router.patch('/me/avatar', validateAvatarUpdate, updateAvatar);

module.exports = router;