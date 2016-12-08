var assert = require('chai').assert;
var jsdom = require('mocha-jsdom');

describe('Boost JS Select Menu', function () {

    jsdom()

    before(function ( done ) {
        $ = require('jquery')
        boost = require('boost-js')
        select = require('../dist/select.min.js')
        $.fn.select = boost( select.plugin, select.defaults );
        done();
    });

    describe('creation', function () {

        it('should have added plugin to jQuery\'s prototype', function () {
            assert.isDefined( $.fn.select );
        });

    });

    describe('instantiation', function () {

    });

    describe('settings', function () {

    });

    describe('changeTo()', function () {

    });

    describe('activeTo()', function () {

    });

    describe('selectedOption()', function () {

    });

    describe('activeOption()', function () {

    });

    describe('nextOption()', function () {

    });

    describe('prevOption()', function () {

    });

    describe('findOption()', function () {

    });

    describe('open()', function () {

    });

    describe('close()', function () {

    });

    describe('toggle()', function () {

    });

    describe('isOpen()', function () {

    });

    describe('setPosition()', function () {

    });

    describe('disable()', function () {

    });

    describe('enable()', function () {

    });

});