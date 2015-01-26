var UtilMixin = {

    mergeDeep: function () {
        this.state = this.state.mergeDeep.apply(this.state, arguments);
        this.emit('change');
    },

    setPath: function ( path, value ) {
        if (typeof path === 'string') {
            this.state = this.state.setIn(path.split('.'), value);
        } else {
            this.state = this.state.setIn(path, value);
        }
        this.emit('change');
    },

    deletePath: function ( path ) {
        if (typeof path === 'string') {
            this.state = this.state.deleteIn(path.split('.'), value);
        } else {
            this.state = this.state.deleteIn(path, value);
        }
        this.emit('change');
    },

    contains: function ( id ) {
        return this.state.contains(id);
    }
};

module.exports = UtilMixin;