process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../src/app');
let should = chai.should();

chai.use(chaiHttp);

describe('Jobs', () => {
    describe('GET jobs/unpaid',() => {
        it('should return all unpaid jobs for user',(done) => {
            //get random profile
            //get random contract with profile id
            chai.request(app)
            .get(`/jobs/unpaid`)
            .set('profile_id','4')
            .end((err,res) => {
                console.log(res.status)
                console.log(res.body)
                done()
            })
        })
    })
    describe('POST /jobs/:job_id/pay',() => {
        it('should return error when contractor tries to pay for job',(done) => {
            chai.request(app)
            .post(`/jobs/5/pay`)
            .set('profile_id','7')
            .end((err,res) => {
                res.should.have.status(401)
                done()
            })
        })
        it('should return error if job paid for',(done) => {
            chai.request(app)
            .post(`/jobs/10/pay`)
            .set('profile_id','3')
            .end((err,res) => {
                res.should.have.status(400)
                done()
            })
        })
        it('should pay for a job successfully',(done) => {
            chai.request(app)
            .post(`/jobs/1/pay`)
            .set('profile_id','1')
            .end((err,res) => {
                res.should.have.status(200)
                done()
            })
        })
    })
})