var Flux = require('react-flux');
var Immutable = require('immutable');
var React = require('react');
var StoreMixins = require('../index');

var Constants = Flux.createConstants([
    "TOAST",
    "TOAST_CLOSE"
]);

var Actions = Flux.createActions({
    toast: [Constants.TOAST, function ( toast ) {
        return toast;
    }],

    closeToast: [Constants.TOAST_CLOSE, function ( id ) {
        return id;
    }]
});

var i = 0;
var nextId = function () {
    return i++;
};

var ToastStore = Flux.createStore({

    mixins: [StoreMixins.Util],

    getInitialState: function () {
        return {
            toast: Immutable.OrderedMap()
        };
    },

    remove: function ( id ) {
        this.setState({
            toast: this.state.get('toast').delete(id)
        });
    },

    push: function ( data ) {
        this.setState({
            toast: this.state.get('toast').set(data.id, data)
        });

        setTimeout(() => {
            this.remove(data.id);
        }, 3000);
    },

    getToast: function () {
        return this.get('toast').values();
    }

}, [

    [Constants.TOAST_SUCCESS, function ( toast ) {
        this.push(Object.assign(toast, { id: nextId() }));
    }],

    [Constants.TOAST_CLOSE_SUCCESS, function ( id ) {
        this.remove(id);
    }]

]);

var Toast = React.createClass({
    render: function () {
        return (
            <div/>
        );
    }
});

var ToastManager = React.createClass({

    mixins: [ToastStore.mixin()],

    getStateFromStores: function () {
        return {
            toast: ToastStore.getToast()
        };
    },

    render: function () {
        return (
            <TransitionGroup component="ul" className="toast">
                {this.state.toast.map(t => <Toast key={t.id} data={t} />)}
            </TransitionGroup>
        );
    }
});

