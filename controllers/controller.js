
const { PatientDetail, Doctor, User, CheckUp, CheckUpDoctor } = require('../models')
class Controller {
    static async showPatientDetail(req, res) {
        try {
            const data = await PatientDetail.findAll()

        } catch (error) {
            res.send(error)
        }
    }

    static async Doctor(req, res) {
        try {
            const data = await Doctor.findAll()
        } catch (error) {
            res.send(error)
        }
    }

    static async CheckUp() {
        try {
            const data = await CheckUp.findAll({

                include: [{
                    model: CheckUpDoctor,
                    as: "",
                    where: {

                    },
                    required: false,

                }
                ]

            })
        } catch (error) {
            res.send(error)
        }
    }
    static async addDoctor(req, res) {

    }

}

module.exports = Controller