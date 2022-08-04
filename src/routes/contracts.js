const express = require('express')
const { Op } = require("sequelize");
const {getProfile} = require('../middleware/getProfile')

const router = express.Router()
router.use(getProfile)

const getContractForUser = async (req,res) => {
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const userType = `${req.profile.type.replace(/^\w/, (c) => c.toUpperCase())}Id`
    const userId = req.profile.id
    const contract = await Contract.findOne({where: {id,[userType]:userId}})    
    if(!contract) return res.status(404).end()
    res.json(contract)
}
router.get('/:id',getContractForUser)

const getAllNonTerminatedContractsForUser = async (req,res) => {
    const {Contract} = req.app.get('models')
    const userType = `${req.profile.type.replace(/^\w/, (c) => c.toUpperCase())}Id`
    const userId = req.profile.id
    const contracts = await Contract.findAll({where: {[userType]:userId,'status':{[Op.not]:'terminated'}}})
    res.json(contracts)
}
router.get('/',getAllNonTerminatedContractsForUser)

module.exports = router