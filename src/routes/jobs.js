const express = require('express')
const {getProfile} = require('../middleware/getProfile')

const router = express.Router()
router.use(getProfile)

const getAllUnpaidJobsForUser = async (req,res) => {
    const {Job,Contract} = req.app.get('models')
    const userType = `${req.profile.type.replace(/^\w/, (c) => c.toUpperCase())}Id`
    const userId = req.profile.id
    const jobs = await Job.findAll({include:{ model:Contract, where:{[userType]:userId,'status':'in_progress'} }})
    res.json(jobs)
}
router.get('/unpaid',getAllUnpaidJobsForUser)

const payForJob = async (req,res) => {
    if(req.profile.type !== 'client') return res.status(401).json({msg:'only a client can pay for a job'})

    const {Job,Contract,Profile} = req.app.get('models')
    const {job_id} = req.params
    const userType = `${req.profile.type.replace(/^\w/, (c) => c.toUpperCase())}Id`
    const userId = req.profile.id

    const job = await Job.findOne({ where:{id:job_id}, include:{ model:Contract, where:{[userType]:userId}, include: [{ model:Profile, as: 'Client'},{ model:Profile, as: 'Contractor'}] }})
    if(!job) return res.status(401).json({msg:'client should own job'})

    if(job.paid) return res.status(400).json({msg:'job already paid for'})

    if( job.Contract.Client.balance < job.price ) return res.status(400).json({msg:"client's balance should be >= job price`"})

    const client_new_bal = job.Contract.Client.balance - job.price;
    const contractor_new_bal = job.Contract.Contractor.balance + job.price;

    console.log({client_new_bal,contractor_new_bal})
    await Profile.update({balance:client_new_bal},{where:{id:job.Contract.Client.id}})
    await Profile.update({balance:contractor_new_bal},{where:{id:job.Contract.Contractor.id}})
    await Job.update({paid:true},{where:{id:job.id}})

    res.json({msg:'ok'})


}
router.post('/:job_id/pay',payForJob)

module.exports = router