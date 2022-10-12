const Router = require('express').Router;

const router = new Router();

router.post('/registration');
router.post('/login');
router.post('/logout'); // delete refresh token from database
router.get('/activate/:link'); // activate account by link
router.get('refresh'); // get new couple tokens: access and refresh (if access died)
router.get('/users'); // private page - user list

module.exports = router;
