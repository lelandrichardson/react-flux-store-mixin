// Actions.js
// ==========

var Flux = require('react-flux');
var $http = require('$http');

var Constants = Flux.createConstants([
    "LIKE",
    "UNLIKE"
], "ACTIONS");

var Actions = Flux.createActions({

    like: [Constants.LIKE, function ( entityId ) {
        return $http.post(`/entity/${entityId}/like`);
    }],

    unlike: [Constants.UNLIKE, function ( entityId ) {
        return $http.post(`/entity/${entityId}/unlike`);
    }]

});

module.exports = Actions;

module.exports.Constants = Constants;



// EntityStore.js
// ==============

var Flux = require('react-flux');
var Constants = require('../actions/Actions').Constants;
var OptimisticStoreMixin = require('../mixins/OptimisticStoreMixin');

var EntityStore = Flux.createStore({

    mixins: [OptimisticStoreMixin]

}, [

    // OPTIMISTIC!

    // NOTE:
    // at the moment, with the react-flux framework, it is really difficult
    // to get the entityId to be passed into this function.
    [Constants.LIKE, function ( entityId ) {
        this.optimisticUpdate(entityId, `LIKE_UNLIKE_${entityId}`, { liked: true });
    }],

    [Constants.UNLIKE, function ( entityId ) {
        this.optimisticUpdate(entityId, `LIKE_UNLIKE_${entityId}`, { liked: false });
    }],


    // SUCCESS!

    [Constants.LIKE_SUCCESS, function ( entity ) {
        this.undoOptimisticUpdate(entity.id, `LIKE_UNLIKE_${entity.id}`);
        this.addOrUpdateEntity(entity);
    }],

    [Constants.UNLIKE_SUCCESS, function ( entity ) {
        this.undoOptimisticUpdate(entity.id, `LIKE_UNLIKE_${entity.id}`);
        this.addOrUpdateEntity(entity);
    }],


    // FAILURE!

    [Constants.UNLIKE_FAIL, function ( entityId ) {
        this.undoOptimisticUpdate(entityId, `LIKE_UNLIKE_${entityId}`);
    }],

    [Constants.UNLIKE_FAIL, function ( entityId ) {
        this.undoOptimisticUpdate(entityId, `LIKE_UNLIKE_${entityId}`);
    }]

]);

module.exports = EntityStore;