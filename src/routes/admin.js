const express = require('express')
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const router = express.Router()

const getBestProfession = async (req,res) => {
    const {Job,Contract,Profile} = req.app.get('models')
    const {start,end} = req.query 

    const start_date = new Date(start)
    const end_date = new Date(end)

    const jobs = await Job.findAll({
                            attributes:[
                                [sequelize.fn('sum', sequelize.col('price')), 'total_price']
                            ],
                            where:{paid:true,createdAt:{ [Op.gte]:start_date,[Op.lte]:end_date}},
                            include:{
                                model: Contract,
                                include:{
                                    model: Profile,
                                    as: 'Contractor'
                                }
                            },
                            group:['Contract.ContractorId'],
                            order: sequelize.literal('total_price DESC'),
                            limit:1
                        });


    res.json({profession:jobs[0].Contract.Contractor.profession})
}
router.get('/best-profession',getBestProfession)

const getBestClient = async (req,res) => {
    const {Job,Contract,Profile} = req.app.get('models')
    const {start,end,limit} = req.query 
    const clean_limit = parseInt(limit) || 2;

    const start_date = new Date(start)
    const end_date = new Date(end)

    const jobs = await Job.findAll({
                            attributes:[
                                [sequelize.fn('sum', sequelize.col('price')), 'total_price']
                            ],
                            where:{paid:true,createdAt:{ [Op.gte]:start_date,[Op.lte]:end_date}},
                            include:{
                                model: Contract,
                                include:{
                                    model: Profile,
                                    as: 'Client'
                                }
                            },
                            group:['Contract.ClientId'],
                            order: sequelize.literal('total_price DESC'),
                            limit: clean_limit,
                        });

    const clients = jobs.map( job => {
        const id = job.Contract.Client.id;
        const fullname = `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`;
        const paid = job.dataValues.total_price;
        return {id,fullname,paid}
    })
    
    res.json(clients)
}
router.get('/best-clients',getBestClient)

module.exports = router