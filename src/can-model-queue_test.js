/* global Person: true */
/* global User: true */
/* global Hero: true */
require('can/model/model');
require('./can-model-queue');
require('can/util/fixture/fixture');
require('can/test/test');
require('steal-qunit');

QUnit.module('can/model/queue', {
	beforeEach: function(assert) {}
});
QUnit.test('queued requests will not overwrite attrs', function(assert) {
	var delay = can.fixture.delay;
	can.fixture.delay = 1000;
	can.Model.extend('Person', {
		create: function (id, attrs, success) {
			return can.ajax({
				url: '/people/' + id,
				data: attrs,
				type: 'post',
				dataType: 'json',
				fixture: function () {
					return {
						name: 'Justin'
					};
				},
				success: success
			});
		}
	}, {});
	var person = new Person({
		name: 'Justin'
	}),
		personD = person.save();
	person.attr('name', 'Brian');
	var done = assert.async();
	personD.then(function (person) {
		done();
		assert.equal(person.name, 'Brian', 'attrs were not overwritten with the data from the server');
		can.fixture.delay = delay;
	});
});
QUnit.test('error will clean up the queue', 2, function(assert) {
	can.Model('User', {
		create: 'POST /users',
		update: 'PUT /users/{id}'
	}, {});
	can.fixture('POST /users', function () {
		return {
			id: 1
		};
	});
	can.fixture('PUT /users/{id}', function (req, respondWith) {
		respondWith(500);
	});
	var u = new User({
		name: 'Goku'
	});
	var done = assert.async();
	u.save();
	var err = u.save();
	u.save();
	u.save();
	u.save();
	err.fail(function () {
		done();
		assert.equal(u._requestQueue.attr('length'), 4, 'Four requests are in the queue');
		var done = assert.async();
		u._requestQueue.bind('change', function () {
			done();
			assert.equal(u._requestQueue.attr('length'), 0, 'Request queue was emptied');
		});
	});
});
QUnit.test('backup works as expected', function(assert) {
	can.Model('User', {
		create: 'POST /users',
		update: 'PUT /users/{id}'
	}, {});
	can.fixture('POST /users', function () {
		return {
			id: 1,
			name: 'Goku'
		};
	});
	can.fixture('PUT /users/{id}', function (req, respondWith) {
		respondWith(500);
	});
	var u = new User({
		name: 'Goku'
	});
	var done = assert.async();
	var save = u.save();
	u.attr('name', 'Krillin');
	save.then(function () {
		done();
		assert.equal(u.attr('name'), 'Krillin', 'Name is not overwritten when save is successful');
		var done = assert.async();
	});
	var err = u.save();
	err.fail(function () {
		u.restore(true);
		done();
		assert.equal(u.attr('name'), 'Goku', 'Name was restored to the last value successfuly returned from the server');
	});
});
QUnit.test('abort will remove requests made after the aborted request', function(assert) {
	can.Model('User', {
		create: 'POST /users',
		update: 'PUT /users/{id}'
	}, {});
	can.fixture('POST /users', function () {
		return {
			id: 1,
			name: 'Goku'
		};
	});
	can.fixture('PUT /users/{id}', function (req) {
		return req.data;
	});
	var u = new User({
		name: 'Goku'
	});
	u.save();
	u.save();
	var abort = u.save();
	u.save();
	u.save();
	assert.equal(u._requestQueue.attr('length'), 5);
	abort.abort();
	assert.equal(u._requestQueue.attr('length'), 2);
});
QUnit.test('id will be set correctly, although update data is serialized before create is done', function(assert) {
	var delay = can.fixture.delay;
	can.fixture.delay = 1000;
	can.Model('Hero', {
		create: 'POST /superheroes',
		update: 'PUT /superheroes/{id}'
	}, {});
	can.fixture('POST /superheroes', function () {
		return {
			id: 'FOOBARBAZ'
		};
	});
	can.fixture('PUT /superheroes/{id}', function (req) {
		done();
		assert.equal(req.data.id, 'FOOBARBAZ', 'Correct id is set');
		can.fixture.delay = delay;
		return req.data;
	});
	var u = new Hero({
		name: 'Goku'
	});
	u.save();
	u.save();
	var done = assert.async();
});
QUnit.test('queue uses serialize (#611)', function(assert) {
	can.fixture('POST /mymodel', function (request) {
		assert.equal(request.data.foo, 'bar');
		done();
	});
	var MyModel = can.Model.extend({
		create: '/mymodel'
	}, {
		serialize: function () {
			return {
				foo: 'bar'
			};
		}
	});
	var done = assert.async();
	new MyModel()
		.save();
});
