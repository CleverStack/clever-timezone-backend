/**
 * @doc module
 * @name timezoneModule.controllers:TimezoneController
 */
module.exports = function ( TimezoneService ) {
    return (require( 'classes' ).Controller).extend(
        {
            service: TimezoneService
        },
        /* @Prototype */
        {

            listAction: function () {

                return TimezoneService.list()
                    .then( this.proxy( 'handleServiceMessage' ) )
                    .fail( this.proxy( 'handleException' ) );
            },

            postAction: function () {
                var action
                    , data = this.req.body;

                if ( !!data.id ) {
                    action = TimezoneService.findById( data.id );
                }
                else if ( !!data.name ) {
                    action = TimezoneService.findByName( data.name );
                }
                else if ( !!data.offset ) {
                    action = TimezoneService.findByOffset( data.offset );
                }
                else {
                    return this.send( 'Insufficient data', 400 );
                }

                return action
                    .then( this.proxy( 'handleServiceMessage' ) )
                    .fail( this.proxy( 'handleException' ) );
            },

            handleServiceMessage: function ( obj ) {
                if ( !!obj && obj.statuscode ) {
                    return this.send( obj.message, obj.statuscode );
                } else {
                    return this.send( obj, 200 );
                }
            },

            handleException: function ( exception ) {
                if ( typeof exception !== "object" || !exception.stack ) {
                    return this.send( 500, exception );
                }
                this._super( exception );
            }
        } );
};