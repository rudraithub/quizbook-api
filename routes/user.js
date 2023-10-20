const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const axios = require('axios')

const router = express.Router()

// const id = {
//     '1': 'student',
//     '2': 'teacher',
//     '3': 'admin'
// }

const professions = [{
    id: 1,
    name: 'student'
}, {
    id: 2,
    name: 'teacher'
}, {
    id: 3,
    name: 'admin'
}
]

router.post('/users/signup', async (req, res) => {


    try {
        const { firstName, lastName, email, gender, DOB,professionId, mobileNumber, user_id } = req.body

     
        const prof = await axios.get('http://localhost:3000/users/profession')
        // console.log(prof.data)

        const availabledata = prof.data

        // console.log('Profession ID from request:', professionId);
        // console.log('Available Professions:', availabledata);
        // availabledata.forEach(proff => {
        //     console.log('ID:', proff.id, 'Type:', typeof proff.id);
        // });

        // const availabledata = prof.data;

        // Move this line before the console.log statements
        const profession = availabledata.find(proff => proff.id === professionId);
        // console.log('Profession ID from request:', professionId);
        // console.log('Selected Profession:', profession);
        // console.log('Available Professions:', availabledata);

        // const profession = availabledata.find(proff => proff.id === professionId);
        // console.log(profession)

        if (!profession) {
            return res.status(400).json({
                status: 400,
                message: "Invalid profession ID"
            });
        }

        const isEmail = await User.findOne({email})
        if(isEmail){
            return res.status(400).json({
                status: 400,
                message: "email is already registered!!!"
            })
        }

        const isMob = await User.findOne({mobileNumber})
        if(isMob){
            return res.status(400).json({
                status: 400,
                message: "mobile nubmer is already registered!!!"
            })
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            gender,
            DOB,
            mobileNumber,
            profession: {
                _id: profession.id,
                name: profession.name
            },
            user_id
        })

        await newUser.save()

        const response = {
            status: 200,
            data: newUser,
            message: 'successfully signup'
        }
        

        res.status(201).json(response)
        // console.log(newUser)
        // console.log(res.status(201).send(newUser))
    } catch (e) {

        const errorRes = {
            status:400,
            message: e.message
        }

        res.status(400).json(errorRes)
        // console.log(e.message)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const { mobileNumber, OTP } = req.body;
        const user = await User.findOne({ mobileNumber });
        // console.log(user)

        if (!user) {
            throw new Error('User not found');
        }
     
        if(!OTP || OTP === null || OTP.toString().length !== 4){
            throw new Error('please provide 4 digit otp')
        }

        const response = {
            status: 200,
            data: user,
            message: 'login sucessfully'
        }

        res.json(response)
    } catch (error) {

        const errorRes = {
            status: 400,
            message: error.message
        }

        res.status(400).json(errorRes);
    }
})

router.get('/users/profession', (req, res) => {
    res.json(professions)
})

module.exports = router
