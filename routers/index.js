const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

//<<<<<< REGISTER
router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegisterForm)

//<<<<<< LOGIN
router.get('/login', Controller.showLogin)
router.post('/login', Controller.postLogin)

const isLoggedIn = function (req, res, next) {
  // console.log(req.session)
  if (!req.session.userId) {
    const error = `you have to login first`
    res.redirect(`/login?err=${error}`)
  } else {
    next()
  }
}

const isAdmin = function (req, res, next) {
  // console.log(req.session)
  if (req.session.role !== 'admin') {
    const error = `Access Denied`
    res.redirect(`/checkup?err=${error}`)
  } else {
    next()
  }
}

router.use(isLoggedIn)

router.get('/', (req, res) => {
  res.redirect('/checkup')
})
router.get('/checkup', Controller.showCheckUp)


router.get('/doctor', Controller.showDoctor)

router.get('/doctor/add', isAdmin, Controller.showAddDoctor)
router.post('/doctor/add', Controller.postAddDoctor)

router.get('/doctor/:id/edit', isAdmin, Controller.showEditDoctor)
router.post('/doctor/:id/edit', Controller.postEditDoctor)

router.get('/doctor/:id/delete', isAdmin, Controller.deleteDoctor)


router.get('/patient',)


module.exports = router