const request = require('supertest');
const server = require('../src/app');

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
	})

	it('[Unit Test] Check for false version number 2/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-38.0.')
		.expect(400, done)
	})

	it('[Unit Test] Check for false version number 3/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-asfl.erqqe.43523')
		.expect(400, done)
	})

	it('[Unit Test] Check for false version number 4/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-3.9.4.3.2.')
		.expect(400, done)
	})

	it('[Unit Test] Check for false version number 5/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'EDOPRO-LINUX-1.2.3alert(\'hek\'')
		.expect(400, done)
	})

	it('[Unit Test] Check for false version number 6/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'Any-thing-EDOPRO-LINUX-30.30.30')
		.expect(400, done)
	})

	it('[Unit Test] Check for false version number 7/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'eDoPrO-WiNdOwS-38.0.0')
		.expect(200, done)
	})

	it('[Unit Test] Check for false version number 8/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'Edopro-Mac-38.0.0')
		.expect(200, done)
	})

	it('[Unit Test] Check for false version number 9/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', 'Linux-39.0.0')
		.expect(400, done)
	})

	it('[Unit Test] Check for false version number 10/10', function(done) {
		request(server)
		.get('/')
		.set('User-Agent', '0.0.83-xuniL-orpodE')
		.expect(400, done)
	})

	it('[Unit Test] Check if it returns a JSON', function(done) {
		request(server)
		.get('/?version=edopro-windows-38.0.0')
		.expect('Content-Type', 'application/json; charset=utf-8')
		.expect(200, done)
	})

	after(function(done) {
		server.close(done);
	});
});