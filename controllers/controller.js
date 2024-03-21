
const { PatientDetail, Doctor, User, Checkup, CheckUpDoctor } = require('../models')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

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

  //<<<<<< LOGOUT
  static async getLogOut(req, res) {
    try {
      req.session.destroy(err => {
        if (err) { console.log(err) }
        else { res.redirect(`/login`) }
      })
    } catch (error) {
      es.send(error)
    }
  }

  //<<<<<< MENU >>>>>>>
  static async showCheckUp(req, res) {
    try {
      let { userId } = req.session
      let { err } = req.query
      // let data = await CheckUp.findAll({
      //   include: CheckUpDoctor
      // })
      res.render('checkup', { err, userId })
    } catch (error) {
      res.send(error)
    }
  }

  static async showPatientDetail(req, res) {
    try {
      let { userId } = req.session
      // console.log(userId)
      let data = await User.findByPk(userId, {
        include: {
          model: PatientDetail
        }
      })
      let local;
      if (data.PatientDetail) {
        local = PatientDetail.localDate(data.PatientDetail.dateOfBirth)
      }
      res.render('patient-detail', { data, local, userId })

    } catch (error) {
      console.log(error)
    }
  }

  static async showAddPatient(req, res) {
    try {
      let { userId } = req.session
      let { error, path } = req.query
      res.render('add-patient', { userId, error, path })
    } catch (error) {
      res.send(error)
    }
  }

  static async postAddPatient(req, res) {
    try {
      let { userId } = req.session
      let { name, gender, dateOfBirth } = req.body
      // console.log(req.body)
      await PatientDetail.create({ name, gender, dateOfBirth, UserId: userId })
      res.redirect(`/patient/${userId}`)
    } catch (error) {
      console.log(error)
    }
  }


  static async showDoctor(req, res) {
    try {
      let { userId, role } = req.session;
      let { notif } = req.query
      let options = {};
      console.log(req.query)
      if (req.query.search) {
        options.name = {
          [Op.iLike]: `%${req.query.search}%`
        };
      }
      const data = await Doctor.findAll({
        where: options,
        order: [['name', 'ASC']]
      })
      // res.send(data)
      res.render('doctor', { data, role, userId, notif })
    } catch (error) {
      res.send(error)
    }
  }

  static async showAddDoctor(req, res) {
    try {
      let { userId } = req.session
      let { error, path } = req.query
      res.render('add-doctor', { error, path, userId })
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
      let { userId } = req.session
      let { id } = req.params
      let { error, path } = req.query
      let data = await Doctor.findByPk(id)
      // res.send(data)
      res.render('edit-doctor', { data, userId, error, path })
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
      let data = await Doctor.findByPk(id)
      await Doctor.destroy({
        where: { id }
      })
      res.redirect(`/doctor?notif=${data.name} was removed`)
    } catch (error) {
      res.send(error)
    }
  }

  static async showAddCheckup(req, res) {
    try {
      let { userId } = req.params
      res.render('add-checkup', { userId })
    } catch (error) {
      res.send(error)
    }
  }

  static async postAddCheckup(req, res) {
    try {
      let { userId } = req.session
      let { appointment, doctorId } = req.body
      console.log(req.body)

      await Checkup.create({ UserId: userId, appointment })

      res.redirect('/')
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = Controller