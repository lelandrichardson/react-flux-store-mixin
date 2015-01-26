var React = require('react/addons');
var Flux = require('react-flux');
var $http = require('$http');

var StoreMixins = require('../index');

var Constants = Flux.createConstants([
    "CUSTOMER_LIST",
    "CUSTOMER_ORDER_LIST"
]);

var AppActions = Flux.createActions({

    listCustomers: [Constants.CUSTOMER_LIST, function ( query, page ) {
        return $http.get('/api/customer/list', { pg: page });
    }],

    listOrdersForCustomer: [Constants.CUSTOMER_ORDER_LIST, function ( customerId, page ) {
        return $http.get(`/api/customer/${customerId}/orders/list`, { pg: page });
    }]

});

var CustomerStore = Flux.createStore({

    mixins: [StoreMixins.Content]

}, [
    [Constants.CUSTOMER_LIST, function ( response ) {
        this.addAll(response.results);
    }]
]);

var OrderStore = Flux.createStore({

    mixins: [StoreMixins.Content]

}, [
    [Constants.CUSTOMER_ORDER_LIST, function ( response ) {
        this.addAll(response.results);
    }]
]);

var OrdersByCustomerStore = Flux.createStore({

    mixins: [
        StoreMixins.IndexedList,
        StoreMixins.TrackProgress
    ]

}, [
    [Constants.CUSTOMER_ORDER_LIST, [OrderStore], function ( response ) {
        this.setItems(response.customerId, response.results);
    }]
]);

var CustomerListStore = Flux.createStore({

    mixins: [StoreMixins.List]

}, [
    [Constants.CUSTOMER_LIST, [CustomerStore], function ( response ) {
        this.setItems(response.results);
    }]
]);

var App = React.createClass({

    mixins: [
        CustomerStore.mixin(),
        ProgressStore.mixin()
    ],

    getInitialState: function () {
        return {
            selected: null
        };
    },

    getStateFromStores: function () {
        return {
            isInProgress: ProgressStore.isInProgress(Constants.CUSTOMER_LIST),
            customers: CustomerListStore.list(),
            orders: OrdersByCustomerStore.getList()
        };
    },

    handleSelect: function ( customer ) {
        AppActions.listOrdersForCustomer(customer._id);
        this.setState({
            selected: customer
        });
    },

    render: function () {

        return (
            <div>
                <div>
                    <div>Customers: {this.state.isInProgress && "Loading..."}</div>
                    <ul>
                        {this.state.customers.map(c => <Customer key={c._id} data={c} onSelect={this.handleSelect} />, this)}
                    </ul>
                </div>
                {this.state.selected && (
                    <div>
                        <div>Orders:</div>
                        <CustomerOrderList customerId={this.state.selected._id} />
                    </div>
                )}
            </div>
        );
    }
});

var CustomerOrderList = React.createClass({

    mixins: [
        OrdersByCustomerStore.mixin(),
        OrderStore.mixin()
    ],

    propTypes: {
        customerId: React.PropTypes.string
    },

    getStateFromStores: function () {
        return {
            isInProgress: OrdersByCustomerStore.isInProgress(Constants.CUSTOMER_ORDER_LIST),
            orders: OrdersByCustomerStore.getList(this.props.customerId).map(OrderStore.get)
        };
    },

    render: function () {
        return (
            <div>
                <div>{this.state.isInProgress && "Loading..."}</div>
                <ul>{this.state.orders.map(o => <Order key={o._id} data={o} />)}</ul>
            </div>
        );
    }
});