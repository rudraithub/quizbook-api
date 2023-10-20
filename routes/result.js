const express = require('express')
const Results = require('../models/result')

const router = express.Router()

router.post('/results', async (req, res) => {
    try{
        const {chapter_id, sub_id,total_que, right_que } = req.body
    
        const result = new Results({
            chapter_id,
            sub_id,
            total_que,
            right_que
        })
    
        await result.save()

        if(!result){
            return res.status(400).json({
                status: 400,
                message: 'data is store'
            })
        }
    
        console.log(result)
    
        res.json({
            status: 200, 
            data: result
        })
    }catch(e){
        res.status(400).json({
            status: 400,
            message: e.message
        })
    }


})

router.get('/results', async (req, res) => {
    try{
        const result = await Results.find()
        res.json({
            status: 200,
            data: result
        })
    }catch{
      res.status(400).json({
        status: 400,
        message: "please complete quiz"
      })
    }
})

module.exports = router