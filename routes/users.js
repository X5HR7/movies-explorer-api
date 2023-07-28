const { getUsers, getUser, updateUser } = require('../controllers/users');
const router = require('express').Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', updateUser);

module.exports = router;
