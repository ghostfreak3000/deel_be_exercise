process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../src/app');
let should = chai.should();

chai.use(chaiHttp);

describe('Contracts', () => {
    describe('GET contracts/:id',() => {
        it('should return all non terminated contracts for profile with :id',(done) => {
            //get random profile
            //get random contract with profile id
            chai.request(app)
            .get(`/contracts`)
            .set('profile_id','7')
            .end((err,res) => {
                console.log(res.status)
                console.log(res.body)
                done()
            })
        })
    })

    describe('GET contracts/:id',() => {
        it('should error when no profile id passed',(done) => {
            chai.request(app)
            .get(`/contracts/1`)
            .end((err,res) => {
                res.should.have.status(401)
                done()
            })
        })

        it('should return contracts for profile with :id',(done) => {
            //get random profile
            //get random contract with profile id
            chai.request(app)
            .get(`/contracts/1`)
            .set('profile_id','1')
            .end((err,res) => {
                console.log(res.status)
                console.log(res.body)
                done()
            })
        })
    })
})