const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const yeps = require('yeps-server');
const redis = require('yeps-redis/redis');
const logger = require('yeps-logger/logger');

const app = require('../../server');

const expect = chai.expect;
chai.use(chaiHttp);
let server;

describe('Server testing', () => {
    logger.info = text => text;
    logger.error = text => text;

    beforeEach(() => {
        server = yeps.createHttpServer(app);
    });

    afterEach(() => {
        server.close();
    });

    it('should test 404 error', async () => {
        const spy = sinon.spy();

        await chai.request(server)
            .get('/404')
            .send()
            .catch((error) => {
                expect(error).to.have.status(404);
                spy();
            });

        expect(spy.calledOnce).to.be.true;
    });

    it('should test static server', async () => {
        const spy = sinon.spy();

        await chai.request(server)
            .get('/index.html')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                spy();
            });

        expect(spy.calledOnce).to.be.true;
    });

    it('should test get data', async () => {
        const spy = sinon.spy();

        await redis.set('data', 'test');

        await chai.request(server)
            .get('/data')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.equal('test');
                spy();
            });

        expect(spy.calledOnce).to.be.true;
    });

    it('should test set data', async () => {
        const spy = sinon.spy();

        const data = 'test';

        await chai.request(server)
            .post('/data')
            .send({ data })
            .then((res) => {
                expect(res).to.have.status(200);
                spy();
            });

        const storedData = JSON.parse(await redis.get('data'));

        expect(storedData.data).to.be.equal(data);

        expect(spy.calledOnce).to.be.true;
    });
});