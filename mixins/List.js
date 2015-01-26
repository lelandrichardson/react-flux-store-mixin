var Immutable = require('immutable');

/**
 * A "List" Store holds an ordered list of identifiers. Typically, this is used
 *
 * The data storage typically looks something like:
 *
 * ```
 *  [ "abc", "def", "xky", ... ]
 * ```
 */
var ListStoreMixin = function ( contentStore ) {

    return {

        mixins: [

        ],

        getInitialState: function () {
            return {
                list: Immutable.List()
            };
        },

        list: function () {
            return this.state.get('list').map(contentStore.get);
        },

        setItems: function ( list ) {
            if (!Immutable.List.isList(list)) {
                list = Immutable.List(list);
            }
            this.state = this.state.set('list', list);
            this.emit('change');
        },

        removeById: function ( id ) {
            var list = this.state.get('list');
            var index =
                this.setState({
                    list: list.merge.apply(list, data)
                });
        }
    };
};