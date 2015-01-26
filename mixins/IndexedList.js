var Immutable = require('immutable');

/**
 * An "Indexed List" Store is a set of id lists, indexed by id. This is essentially a storage mechanism for 1:many
 * relationships in memory. A canonical example for this might be a Store that stores the set of "Order" entities
 * for a given "Customer".
 *
 * The data storage typically looks something like:
 *
 * ```
 *  {
 *      "abc": [ "xyz", "r23", "thq", ... ],
 *      "def": [ "xyz", "r23", "thq", ... ],
 *      ...
 *  }
 * ```
 *
 */
var IndexedListStoreMixin = {

    mixins: [
        UtilMixin
    ],

    getList: function ( id ) {
        if(!this.state.contains(id)) {
            this.state = this.state.set(id, Immutable.List());
            // TODO: I'm not sure if this change event is needed or not
            this.emit('change');
        }
        return this.get(id);
    },

    setList: function ( id, list ) {
        if (!Immutable.List.isList(list)) {
            list = Immutable.List(list);
        }
        this.state = this.state.set(id, list);
        this.emit('change');
    },

    addToList: function ( id, list ) {

    },

    removeFromList: function ( id, list ) {

    },

};

module.exports = IndexedListStoreMixin;