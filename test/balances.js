process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../src/app');
let should = chai.should();

chai.use(chaiHttp);

describe('Balances', () => {
    describe('POST /balances/deposit/:userId',() => {
        it('should return error if user not found',(done) => {
            chai.request(app)
            .post(`/balances/deposit/100`)
            .end((err,res) => {
                res.should.have.status(404)
                done()
            })
        })

        it('should return error if user not client',(done) => {
            //get random profile
            //get random contract with profile id
            chai.request(app)
            .post(`/balances/deposit/7`)
            .end((err,res) => {
                res.should.have.status(400)
                done()
            })
        })

        it('should deposit successfully',(done) => {
            chai.request(app)
            .post(`/balances/deposit/1`)
            .send({amount:20})
            .end((err,res) => {
                res.should.have.status(200)
                done()
            })
        })
    })
})