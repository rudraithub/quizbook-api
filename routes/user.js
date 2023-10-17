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
        const { firstName, lastName, email, gender, DOB,professionId, mobileNumber } = req.body
        
        res.setHeader("Content-Type", "application/json")
     
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
                status: "fail",
                error: "Invalid profession ID"
            });
        }

        const isEmail = await User.findOne({email})
        if(isEmail){
            res.status(400).json({
                status: "fails",
                error: "email is already registered!!!"
            })
        }

        const isMob = await User.findOne({mobileNumber})
        if(isMob){
            res.status(400).json({
                status: "fails",
                error: "mobile nubmer is already registered!!!"
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
            }
        })

        await newUser.save()
        

        return res.status(201).json({
            status: "success",
            newUser
        })
        // console.log(newUser)
        // console.log(res.status(201).send(newUser))
    } catch (e) {
        res.status(400).json({
            status: "fail",
            error: e.message
        })
        // console.log(e.message)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        const user = await User.findOne({ mobileNumber });
        // console.log(user)

        if (!user) {
            throw new Error('User not found');
        }

        res.json({
            status: "success",
            user
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message
        });
    }
});

router.get('/users/profession', (req, res) => {
    res.json(professions)
})

module.exports = router

