const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const { body } = require('express-validator');

const router = new Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 24 }),  
  userController.registration
);

    router.post('/login', userController.login);
    router.post('/logout', userController.logout); // delete refresh token from database
router.get('/activate/:link', userController.activate); // activate account by link
    router.get('/refresh', userController.refresh); // get new couple tokens: access and refresh (if access died)
    router.get('/users', userController.getUsers); // private page - user list

module.exports = router;
