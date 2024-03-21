const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()


router.get('/checkup', Controller.showCheckUp)


router.get('/doctor', Controller.showDoctor)

router.get('/doctor/add', Controller.showAddDoctor)
router.post('/doctor/add', Controller.postAddDoctor)

router.get('/doctor/:id/edit', Controller.showEditDoctor)
router.post('/doctor/:id/edit', Controller.postEditDoctor)

router.get('/doctor/:id/delete', Controller.deleteDoctor)


router.get('/patient',)


module.exports = router