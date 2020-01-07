let User = require('../../models/user');
const auth = require('../../lib/auth');
const bcrypt = require("bcryptjs");
const smsService = require('../../lib/sms');
const emailTemplate = require("../../lib/templates");
const emailService = require('../../lib/mailer');
const util = require('../../common/auth');
const responseFile = require('../../lib/response');



module.exports.auth = function (utils) {
  return {

    signUp: (request, response) => {

      let password = request.body.password;
      let hash = bcrypt.hashSync(password);
      request.body.password = hash;
      request.body.is_active = true;

      User.getModel().findOne({ "mobile": request.body.mobile }).then((userDetails) => {
        if (!userDetails) {
          User.getModel().insertMany(request.body).then((result) => {
            if (result) {
              utils.sendResponse(response, false, 200, 4000);
            }
          }).catch((error) => {
            utils.sendResponse(response, true, 500, 1000);
          })

        } else if (userDetails && userDetails.mobile === request.body.mobile && userDetails.is_active === false) {
          User.getModel().findOneAndUpdate({ "mobile": request.body.mobile }, { $set: { "is_active": true } }).then((result) => {
            if (result) {
              utils.sendResponse(response, false, 200, 4000);
            }
          }).catch((error) => {
            utils.sendResponse(response, true, 500, 1000);
          })
        }
        else {
          utils.sendResponse(response, false, 200, 4034);
        }
      })

    },
    logIn: (request, response) => {
      let mobile = request.body.mobile;
      let password = request.body.password;
      User.getModel().findOne({ mobile: mobile }).then((userDetails) => {
        if (!userDetails) {
          utils.sendResponse(response, false, 200, 4002);
        } else {
          bcrypt.compare(password, userDetails.password, async (error, result) => {
            if (error) {
              utils.sendResponse(response, true, 400, 4005);
            } else if (!result) {
              utils.sendResponse(response, false, 200, 4007);
            } else {
              let payload = {
                id: userDetails._id
                // email: userDetails.email,
                // name: userDetails.name,
                // mobile: userDetails.mobile
              }
              let token = await auth.generateAuthToken(payload);
              let output = {
                error: false,
                msg: responseFile[4001]['msg'],
                code: responseFile[4001]['code'],
                token: token,
                data: payload
              }
              response.status(200).send(output);
            }
          });

        }
      }).catch((error) => {
        utils.sendResponse(response, true, 500, 1000);
      })
    },

    logOut: (request, response) => {

      console.log("Authentication Done");

    },
    sendPhoneCode: (request, response) => {
      let user_id = request.headers.payload.id;
      User.getModel().findById(user_id).then(async (userDetails) => {
        let { mobile } = userDetails;
        if (userDetails.is_phone_verified) {
          return utils.sendResponse(response, false, 200, 4020);
        }
        let OTP = util.generateOTP("phone");
        let paramForMsg = util.prepareOTPParam("phone", OTP);
        let otpDateTime = new Date();
        await util.putOTPIntoCollection(user_id, mobile, OTP, otpDateTime, "phone");

        smsService.sendMsg(paramForMsg, mobile, function (err, done) {
          if (err) {
            utils.sendResponse(response, true, 200, 4010);
          } else {
            utils.sendResponse(response, false, 200, 4009);
          }
        })
      }).catch((error) => {
        utils.sendResponse(response, true, 500, 1000);
      })
    },
    sendEmailCode: (request, response) => {

      let user_id = request.headers.payload.id;
      User.getModel().findById(user_id).then(async (userDetails) => {
        let { email } = userDetails;
        if (userDetails.is_email_verified) {
          return utils.sendResponse(response, false, 200, 4011);
        }
        let OTP = util.generateOTP("email");
        let paramForMsg = util.prepareOTPParam("email", OTP);
        let otpDateTime = new Date();
        await util.putOTPIntoCollection(user_id, email, OTP, otpDateTime, "email");

        emailService.sendEmail(email, "Verification", paramForMsg, function (output) {
          if (!output.error) {
            response.status(200).send(output);
          } else {
            response.status(400).send(output);
          }
        })
      }).catch((error) => {
        utils.sendResponse(response, true, 500, 1000);
      })
    },

    verifyEmailCode: async function (request, response) {

      let email = request.body.email;
      let code = request.body.code;
      let user_id = request.headers.payload.id;
      try {
        let otpData = await util.getUserOTP(user_id, email, "email");
        let OTP = otpData[0] ? otpData[0].email_otp : "";
        let email_otp_datetime = otpData[0] ? otpData[0].email_otp_datetime : "";
        if (OTP == code) {
          if (util.isOTPNotExpired(email_otp_datetime, "email")) {
            await util.updateVerifyStatus(user_id, "email");
            //send Thanks Email
            utils.sendResponse(response, false, 200, 4016);
          } else {
            utils.sendResponse(response, false, 200, 4013);
          }
        } else {
          utils.sendResponse(response, false, 200, 4018);
        }
      } catch (error) {
        utils.sendResponse(response, true, 500, 1000);
      }
    },
    verifyMobileCode: async function (request, response) {

      let mobile = request.body.mobile;
      let code = request.body.code;
      let user_id = request.headers.payload.id;
      try {
        let otpData = await util.getUserOTP(user_id, mobile, "phone");
        let OTP = otpData[0] ? otpData[0].mobile_otp : "";
        if (OTP == code) {
          await util.updateVerifyStatus(user_id, "phone")
          utils.sendResponse(response, false, 200, 4012);
        } else {
          utils.sendResponse(response, false, 200, 4014);
        }
      } catch (error) {
        utils.sendResponse(response, true, 500, 1000);
      }
    },

    forgotPassword: (request, response) => {
      const email = request.body.email;
      User.getModel().findOne({ email: email }).then(async (user) => {
        if (!user) {
          utils.sendResponse(response, false, 200, 4002);
        }
        else {
          const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            mobile: user.mobile
          }
          const token = await auth.generateAuthToken(payload);
          const url = `${process.env.HOST}/forgot-password/${token}`;
          const template = emailTemplate.emailTemplate('forgotPassword', url);
          emailService.sendEmail(email, "ForgotPassword", template, function (output) {
            if (!output.error) {
              response.status(200).send(output);
            } else {
              response.status(400).send(output);
            }
          })

        }
      }).catch((error) => {
        utils.sendResponse(response, true, 500, 1000);
      })
    },
  }

}
