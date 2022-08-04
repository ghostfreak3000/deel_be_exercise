process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../src/app');
let should = chai.should();

chai.use(chaiHttp);

describe('Admin', () => {
    describe('GET /admin/best-profession?start=<date>&end=<date>',() => {
        it('should return the best profession',(done) => {
            chai.request(app)
            .get(`/admin/best-profession`)
            .query({start: '2022-08-01', end: '2022-08-05'})
            .end((err,res) => {
                console.log(res.status)
                console.log(JSON.stringify(res.body,null,2))
                done()
            })
        })
    })

    describe('GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>',() => {
        it.only('should return the best clients',(done) => {
            chai.request(app)
            .get(`/admin/best-clients`)
            .query({start: '2022-08-01', end: '2022-08-05', limit:'3'})
            .end((err,res) => {
                console.log(res.status)
                console.log(JSON.stringify(res.body,null,2))
                done()
            })
        })
    })

})