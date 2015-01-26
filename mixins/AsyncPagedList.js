/**
 *
 * Expects owner store to override the following methods:
 *
 * ```
 *  {
 *
 * ```
 *
 */

var DEFAULT_ASYNC_PAGED_LIST_OPTIONS = {
    pageSize: 20,
    httpMethod: "GET"
};
var AsyncPagedListStoreMixin = function (spec) {


    var options = Object.assign({}, DEFAULT_ASYNC_PAGED_LIST_OPTIONS, spec);

    return {

        mixins: [
            ListStoreMixin
        ],

        getInitialState: function () {
            return {
                currentPage: 0
            };
        },

        receivePage: function ( data ) {
            var list = this.state.get('list');
            this.setState({
                list: list.merge.apply(list, data),
                currentPage: this.state.get('currentPage') + 1
            });
        }
    };
};

module.exports = AsyncPagedListStoreMixin;