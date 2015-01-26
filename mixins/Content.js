/**
 * A "Content Store" holds app entities as a hash-map based on some identifier. This store becomes the "source of truth"
 * for entities of that type. Typically, other types of stores like "List" Stores or "IndexedList" Stores will ask
 * content stores for their data.
 *
 * The data storage typically looks something like:
 *
 * ```
 *  {
 *      "abc": {
 *          "_id": "abc",
 *          ...
 *      },
 *      "def": {
 *          "_id": "def",
 *          ...
 *      },
 *      ...
 *  }
 * ```
 */
var ContentStoreMixin = {

    /**
     * Overridable. This is the function used to get an identifier from an entity.
     *
     * Defaults to: `data => data._id`
     * @param data
     * @returns {*}
     */
    identifier: function ( data ) {
        return data['_id'];
    },

    get: function ( id ) {
        return this.state.get(id);
    },

    contains: function ( id ) {
        return this.state.contains(id);
    },

    add: function ( data ) {
        this.state = this.state.set(this.identifier(data), data);
        this.emit('change');
    },

    addAll: function ( list ) {
        var state = {};
        list.forEach(function ( item ) {
            state[this.identifier(item)] = item;
        }, this);
        this.state.merge(state);
        this.emit('change');
    },

    remove: function ( data ) {

    }
};

module.exports = ContentStoreMixin;