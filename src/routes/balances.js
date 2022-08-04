const express = require('express')
const { Op } = require("sequelize");
const router = express.Router()

const deposit = async (req,res) => {
    const {Profile,Job,Contract} = req.app.get('models')
    const {userId} = req.params
    const {amount} = req.body

    const user = await Profile.findOne({where:{id:userId}})
    if(!user) return res.status(404).json({msg:'user not found'})

    if(user.type !== 'client') return res.status(400).json({msg:'user should be a client'})

    if(amount <= 0) return res.status(400).json({msg:'amount should be > 0'})

    const total_jobs_to_pay = await Job.sum('price',{ where:{paid:{[Op.not]:true}}, include:{ model: Contract, where:{'ClientId':userId}} });
    const deposit_limit = total_jobs_to_pay * .25

    if( amount > deposit_limit ) return res.status(400).json({msg:`amount should be <= ${deposit_limit}`})

    const new_balance = user.balance + amount;
    
    await Profile.update({balance:new_balance},{where:{id:userId}})
    
    res.json({msg:'ok'})
}
router.post('/deposit/:userId',deposit)

module.exports = router