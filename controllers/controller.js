
const { PatientDetail, Doctor, User, CheckUp, CheckUpDoctor } = require('../models')
const bcrypt = require('bcryptjs');

class Controller {

  //<<<<<< REGISTER
  static async registerForm(req, res) {
    try {
      res.render('register')
    } catch (error) {
      res.send(error)
    }
  }

  static async postRegisterForm(req, res) {
    try {
      let { email, password, role } = req.body
      await User.create({ email, password, role })
      res.redirect('/login')
      // console.log(req.body)
    } catch (error) {
      console.log(error)
    }
  }


  //<<<<<< LOGIN
  static async showLogin(req, res) {
    try {
      let { err } = req.query
      res.render('login', { err })
    } catch (error) {
      res.send(error)
    }
  }

  static async postLogin(req, res) {
    try {
      let { email, password } = req.body;
      // console.log(req.body)
      let data = await User.findOne({ where: { email } })
      if (!data) {
        const error = `Invalid email/password`
        return res.redirect(`/login?err=${error}`)
      }
      if (email) {
        const isValidPass = bcrypt.compareSync(password, data.password);
        if (isValidPass) {

          req.session.userId = data.id;
          req.session.role = data.role;

          return res.redirect('/checkup')
        } else {
          const error = `Invalid email/password`
          return res.redirect(`/login?err=${error}`)
        }
      }

    } catch (error) {
      res.send(error)
    }
  }

  static async showCheckUp(req, res) {
    try {
      let { err } = req.query
      // let data = await CheckUp.findAll({
      //   include: CheckUpDoctor
      // })

      res.render('checkup', { err })
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
      let { role } = req.session
      const data = await Doctor.findAll()
      // res.send(data)
      res.render('doctor', { data, role })
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