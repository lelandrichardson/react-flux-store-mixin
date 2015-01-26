var TrackProgressMixin = {

    trackProgress: function ( constant ) {
        this.addActionHandler(constant, {
            getInitialState: function () {
                return {
                    isInProgress: false
                };
            },
            before: function () {
                this.setState({ isInProgress: true });
            },
            after: function () {
                this.setState({ isInProgress: false });
            }
        });
    },

    isInProgress: function ( constant ) {
        return this.getActionState(constant, 'isInProgress');
    }
};

module.exports = TrackProgressMixin;