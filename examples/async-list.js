var React = require('react/addons');
var Flux = require('react-flux');
var $http = require('$http');

var StoreMixins = require('../index');


var Constants = Flux.createConstants([
    "SEARCH"
]);

var EntityActions = Flux.createActions({
    search: [Constants.SEARCH, function ( query, page ) {
        return $http.get('/api/entity/search', { q: query, pg: page });
    }]
});




var EntityStore = Flux.createStore({

    mixins: [StoreMixins.Content]

},[
    [Constants.SEARCH_SUCCESS, function ( response ) {
        response.results.forEaach(this.add, this);
    }]
]);




var SearchStore = Flux.createStore({

    mixins: [StoreMixins.List],

    results: function () {
        return this.list().map(EntityStore.get);
    }
},[
    [Constants.SEARCH_SUCCESS, function ( response ) {
        this.setItems(response.results);
    }]
]);




var SearchResults = React.createClass({

    mixins: [
        React.addons.LinkedStateMixin,
        SearchStore.mixin()
    ],

    getInitialState: function () {
        return {
            query: ''
        };
    },

    getStateFromStores: function () {
        return {
            page: SearchStore.page(),
            pageStart: SearchStore.pageStart(),
            pageEnd: SearchStore.pageEnd(),
            totalItems: SearchStore.totalItems(),
            results: SearchStore.results()
        };
    },

    handleQueryChange: function (e) {
        this.setState({
            query: e.target.value
        });

        EntityActions.search(e.target.value, this.state.page);
    },

    handleNext: function () {
        EntityActions.search(this.state.query, this.state.page + 1);
    },

    handlePrev: function () {
        EntityActions.search(this.state.query, this.state.page - 1);
    },

    render: function () {

        var items = this.state.results.map(function (item) {
            return <SearchResultItem key={item._id} item={item} />;
        });

        return (
            <div>
                <input type="text" onChange={this.handleQueryChange} value={this.state.query} />
                <button onClick={this.handleNext}>Next Page</button>
                <button onClick={this.handlePrev}>Prev Page</button>
                <div>Showing {this.state.pageStart} - {this.state.pageEnd} of {this.state.totalItems} items</div>
                <ul>{items}</ul>
            </div>
        );
    }
});