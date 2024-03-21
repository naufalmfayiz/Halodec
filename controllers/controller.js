
const { PatientDetail, Doctor, User, CheckUp, CheckUpDoctor } = require('../models')

class Controller {

  static async showCheckUp(req, res) {
    try {
      // let data = await CheckUp.findAll({
      //   include: CheckUpDoctor
      // })

      res.render('checkup')
    } catch (error) {
      res.send(error)
    }
  }

  static async showPatientDetail(req, res) {
    try {
      const data = await PatientDetail.findAll()

    } catch (error) {
      res.send(error)
    }
  }

  static async showDoctor(req, res) {
    try {
      const data = await Doctor.findAll()
      // res.send(data)
      res.render('doctor', { data })
    } catch (error) {
      res.send(error)
    }
  }

  static async showAddDoctor(req, res) {
    try {
      let { error, path } = req.query
      res.render('add-doctor', { error, path })
    } catch (error) {
      res.send(error)
    }
  }

  static async postAddDoctor(req, res) {
    try {
      let { name, specialist } = req.body
      await Doctor.create({ name, specialist })
      res.redirect('/doctor')
      // console.log(req.body)
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        let err = error.errors.map((el) => {
          return el.message
        })
        let path = error.errors.map((el) => {
          return el.path
        })
        res.redirect(`/doctor/add?error=${err}&path=${path}`)
      } else {
        res.send(error)
      }
    }
  }

  static async showEditDoctor(req, res) {
    try {
      let { id } = req.params
      let { error, path } = req.query
      let data = await Doctor.findByPk(id)
      // res.send(data)
      res.render('edit-doctor', { data, error, path })
    } catch (error) {
      res.send(error)
    }
  }

  static async postEditDoctor(req, res) {
    let { id } = req.params
    try {
      let { name, specialist, cost } = req.body
      await Doctor.update({ name, specialist, cost }, { where: { id } })

      res.redirect('/doctor')
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        let err = error.errors.map((el) => {
          return el.message
        })
        let path = error.errors.map((el) => {
          return el.path
        })
        res.redirect(`/doctor/${id}/edit?error=${err}&path=${path}`)
      } else {
        res.send(error)
      }
    }
  }

  static async deleteDoctor(req, res) {
    try {
      let { id } = req.params
      await Doctor.destroy({
        where: { id }
      })
      res.redirect('/doctor')
    } catch (error) {
      res.send(error)
    }
  }

}

module.exports = Controller