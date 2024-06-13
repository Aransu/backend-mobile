import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import {
  generateRandomFiveDigitNumberAsString,
  generateRandomPassword,
} from "../utils/function.js";

dotenv.config();

const { SECRET_CODE } = process.env.NODE_ENV !== "production";

const registerService = async (req, res) => {
  try {
    const { name, password, email, phone_number } = req.body;

    if (!name || !password || !email || !phone_number) {
      return res.status(400).json({
        status: "FAILED",
        message: "Missing required fields",
      });
    }

    const createdAt = Date.now();
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone_number,
      created_at: createdAt,
      update_at: createdAt,
      profile_image: 'https://api.dicebear.com/7.x/lorelei/png',
      isHost: false
    });

    const savedUser = await newUser.save();
    savedUser.password = undefined;
    return { user: savedUser };
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: "FAILED",
      message: "An error occurred",
      error: err.message,
    });
    return { user: null };
  }
};

const loginService = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email == "" || password == "") {
      res.status(400).json({
        status: 400,
        message: "Empty credentials",
      });
      return { user: null };
    }

    const data = await User.findOne({ email });
    if (data) {
      const hashedPassword = data.password;
      const result = await bcrypt.compare(password, hashedPassword);

      if (result) {
        const token = jwt.sign(
          {
            email: data.email,
            password: data.password,
            _id: data._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "365d",
          }
        );
        data.password = undefined;
        return { user: data, token: token };
      } else {
        res.status(401).json({
          status: 401,
          message: "Invalid credential",
        });
        return { user: null };
      }
    } else {
      res.status(401).json({
        status: 401,
        message: "Invalid credential",
      });

      return { user: null };
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({
      status: 401,
      error: err,
    });
    return { user: null };
  }
};

const forgotPasswordService = async (req, res) => {
  try {
    console.log("call forget password");
    const { email } = req.body;
    if (!email) {
      return { status: 400, message: "Missing Email" };
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    let testAccount = await nodemailer.createTestAccount();
    const mailerConfig = {
      service: "gmail",
      auth: {
        user: "testlaravelalala@gmail.com",
        pass: "coflwwdlhdvdnjsg",
      },
    };
    const transporter = nodemailer.createTransport(mailerConfig);
    const OTPGenerated = generateRandomFiveDigitNumberAsString();
    const newOTP = new otp({
      email: user.email,
      OTP: OTPGenerated,
    });

    await newOTP.save();

    const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Home</title>
    </head>
        <body style = "margin:0;
                        padding:0;
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color:darkblue">
            <div>
                <h1 style="text-align:center;
                            margin-top: 50px;
                            color:darkblue;
                        font-size:24px">New password</h1>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Hello <strong>${user.name}</strong></p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Here is your OTP</p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Please do not share this information</p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Your OTP is: </p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:30px"><strong>${OTPGenerated}</strong></p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Use this OTP to validate and change your password</p>
            </div>
    </body>
    </html>`;
    transporter.sendMail({
      from: '"Airbnb" <AirbnbClone@gmail.com',
      to: email,
      subject: "Reset password",
      html: message,
    });
    return { status: 200, message: "Check your email for the OTP" };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const checkOTPService = async (req, res) => {
  try {
    console.log("call forget password");
    const { email, OTP } = req.body;
    if (!email || !OTP) {
      return { status: 400, message: "Missing email or OTP" };
    }
    const isValid = await otp.findOne({ email: email, OTP: OTP });
    //  console.log("isValid: ", isValid);

    if (!isValid) {
      return { status: 401, message: "Invalid OTP" };
    }
    const user = await User.findOne({ email: email });
    const newPassword = generateRandomPassword();
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Home</title>
    </head>
        <body style = "margin:0;
                        padding:0;
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color:darkblue">
            <div>
                <h1 style="text-align:center;
                            margin-top: 50px;
                            color:darkblue;
                        font-size:24px">New password</h1>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Hello <strong>${user.name}</strong></p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Here is your new auto generated password</p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Please do not share this information</p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Your new password is: </p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:30px"><strong>${newPassword}</strong></p>
                <p style="text-align:center;
                            margin-top: 20px;
                            color:darkblue;
                            font-size:15px">Use this OTP to validate and change your password</p>
            </div>
    </body>
    </html>`;
    const mailerConfig = {
      service: "gmail",
      auth: {
        user: "testlaravelalala@gmail.com",
        pass: "coflwwdlhdvdnjsg",
      },
    };
    const transporter = nodemailer.createTransport(mailerConfig);
    transporter.sendMail({
      from: '"Airbnb" <AirbnbClone@gmail.com',
      to: email,
      subject: "Reset password",
      html: message,
    });
    return {
      status: 200,
      message: "Congratulation🎉! Check your email for your new password",
    };
  } catch (error) {
    return { status: 404, message: "Catch error" };
  }
};

export {
  checkOTPService,
  forgotPasswordService,
  loginService,
  registerService,
};
