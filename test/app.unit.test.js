process.env.HERCULES_BASE_DB="update.test.db"

const request = require('supertest');
const server = require('../src/app');
const fs = require('fs');

describe('Unit Testing of App.js', function() {

	it('[Unit Test] Check if server return an error if no query parameter or user-agent', function(done) {
		request(server)
		.get('/')
		.expect(400, done);
	});

	it('[Unit Test] Check if the server accept Version query parameter', function(done) {
		request(server)
		.get('/?version=EDOPRO-LINUX-38.0.0')
		.expect(200, done)
	});

	it('[Unit Test] Check if the server accept Version of User-Agent', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-38.0.0')
		.expect(200, done)
	});

	it('[Unit Test] Check for false version number 1/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-38')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 2/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-38.0.')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 3/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-asfl.erqqe.43523')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 4/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-3.9.4.3.2.')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 5/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-1.2.3alert(\'hek\'')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 6/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'Any-thing-EDOPRO-LINUX-30.30.30')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 7/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'eDoPrO-WiNdOwS-38.0.0')
		.expect(200, done)
	});

	it('[Unit Test] Check for false version number 8/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'Edopro-Mac-38.0.0')
		.expect(200, done)
	});

	it('[Unit Test] Check for false version number 9/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'Linux-39.0.0')
		.expect(400, done)
	});

	it('[Unit Test] Check for false version number 10/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', '0.0.83-xuniL-orpodE')
		.expect(400, done)
	});

	it('[Unit Test] Check if it returns a JSON', function(done) {
		request(server)
		.get('/?version=edopro-windows-38.0.0')
		.expect('Content-Type', 'application/json; charset=utf-8')
		.expect(200, done)
	});

	it('[Unit Test] Blank POST to /version End-Point', function(done) {
		request(server)
		.post('/version')
		.expect(400, done)
	});

	it('[Unit Test] POST with only authToken to /version End-Point', function(done) {
		request(server)
		.post('/version')
		.send({
			authToken: ''
		})
		.expect(400, done)
	});

	it('[Unit Test] POST blank to /version End-Point', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: '',
            url: '',
            os: '',
            major: '',
            minor: '',
            patch: '',
            hash: ''

		})
		.expect(401, done)
	});

	it('[Unit Test] POST blank to /version End-Point with wrong authToken', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: 'A Bad Auth Token',
            url: '',
            os: '',
            major: '',
            minor: '',
            patch: '',
            hash: ''

		})
		.expect(401, done)
	});

	it('[Unit Test] POST blank to /version End-Point with correct authToken', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: process.env.HERCULES_BASE_SECRET,
            url: '',
            os: '',
            major: '',
            minor: '',
            patch: '',
            hash: ''

		})
		.expect(400, done)
	});

	it('[Unit Test] POST to /version End-Point with correct input 1/5', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: process.env.HERCULES_BASE_SECRET,
            url: 'http://www.example.com',
            os: 'Windows',
            major: '38',
            minor: '0',
            patch: '1',
            hash: '12345'

		})
		.expect(201, done)
	});

	it('[Unit Test] POST to /version End-Point with correct input 2/5', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: process.env.HERCULES_BASE_SECRET,
            url: 'http://www.example.com',
            os: 'Mac',
            major: '38',
            minor: '0',
            patch: '1',
            hash: '12345'

		})
		.expect(201, done)
	});


	it('[Unit Test] POST to /version End-Point with correct input 3/5', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: process.env.HERCULES_BASE_SECRET,
            url: 'http://www.example.com',
            os: 'Linux',
            major: '38',
            minor: '0',
            patch: '1',
            hash: '12345'

		})
		.expect(201, done)
	});

	it('[Unit Test] POST to /version End-Point with correct input 4/5', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: process.env.HERCULES_BASE_SECRET,
            url: 'http://www.example.com',
            os: 'Windows',
            major: '38',
            minor: '0',
            patch: '2',
            hash: '12345'

		})
		.expect(201, done)
	});

	it('[Unit Test] POST to /version End-Point with correct input 5/5', function(done) {
		request(server)
		.post('/version')
		.send({
	        authToken: process.env.HERCULES_BASE_SECRET,
            url: 'http://www.example.com',
            os: 'Windows',
            major: '39',
            minor: '0',
            patch: '0',
            hash: '12345'

		})
		.expect(201, done)
	});

	it('[Unit Test] GET / after adding entries', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-Linux-38.0.0')
		.expect('Content-Type', 'application/json; charset=utf-8')
		.expect([
			{
				name: '38.0.1',
				md5: '12345',
				url: 'http://www.example.com'
			}
		])
		.expect(200, done)
	});

	after(function(done) {
        server.close(() => {
            fs.unlinkSync(process.env.HERCULES_BASE_DB);
            done();
        });
	});
});
