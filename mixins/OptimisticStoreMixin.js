var Immutable = require('immutable');
var ContentStoreMixin = require('../mixins/ContentStoreMixin');

var generateId = (function () {
    var i = 0;
    return function () {
        return i++;
    };
}());

/**
 * A mixin that helps a store make optimistic updates safely
 */
var OptimisticStoreMixin = {

    mixins: [ContentStoreMixin],

    storeDidMount: function () {

        /**
         * This is where we old the ordered queue of optimistic updates
         * that are currently unresolved. Object takes the form:
         *
         * ```
         *  {
         *      "aBcD": [ 123, 456 ],
         *      "xYzF": [ 987, 654 ],
         *      ...
         *  }
         * ```
         */
        this._optimisticUpdateQueue = {};

        /**
         * This is where we old the ordered queue of optimistic updates
         * that are currently unresolved. Object takes the form:
         *
         * ```
         *  {
         *      123: { "prop1" : "value1" },
         *      456: { "prop2" : "value2" },
         *      ...
         *  }
         * ```
         */
        this._optimisticUpdates = {};
    },

    get: function ( id ) {
        var entity = this.state.get(id);
        var updates = this._optimisticUpdateQueue[id];
        if (updates) {
            // apply action queue to post
            entity = Object.assign({}, entity, ...updates.map(x => this._optimisticUpdates[x]));
        }
        return entity;
    },

    optimisticUpdate: function ( entityId, updateId, update ) {
        var queue;

        // store this update
        this._optimisticUpdates[updateId] = update;

        // add to the queue or create a fresh queue
        if (queue = this._optimisticUpdateQueue[entityId]) {
            queue.push(update);
        } else {
            queue = [update];
        }

        this._optimisticUpdateQueue[entityId] = queue;

        this.emitChange();
    },

    undoOptimisticUpdate: function ( entityId, updateId ) {

        // find the corresponding action in the queue and delete
        var queue = this._optimisticUpdateQueue[entityId];
        queue.splice(queue.indexOf(updateId), 1);

        // we don't need this anymore
        delete this._optimisticUpdates[updateId];

        // state has changed
        this.emitChange();
    }

};

module.exports = OptimisticStoreMixin;