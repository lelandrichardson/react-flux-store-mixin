var DEFAULT_STATIC_PAGED_LIST_OPTIONS = {
    pageSize: 20
};


/**
 *
 */
var StaticPagedListStoreMixin = function (spec) {

    var options = Object.assign({}, DEFAULT_STATIC_PAGED_LIST_OPTIONS, spec);

    return {

        mixins: [
            ListStoreMixin
        ],

        getInitialState: function () {
            return {
                total: 0,
                currentPage: 0
            };
        },

        getPage: function ( page ) {
            return this.list().toSeq().skip(options.pageSize * page).take(options.pageSize);
        }
    };
};

module.exports = StaticPagedListStoreMixin;