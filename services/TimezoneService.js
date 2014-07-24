var BaseService = require( 'services' ).BaseService
    , TimezoneService = null
    , Q = require( 'q' )
    , _ = require( 'lodash' );

var errMs = { statuscode: 400, message: "Insufficient data" };

var normalize = function ( data ) {
    var result;
    var norm = function ( obj ) {
        return {
            id: obj._id || obj.id,
            name: obj.name,
            offset: obj.offset
        }
    };

    if ( _.isArray( data ) ) {
        result = [];
        _.forEach( data, function ( obj ) {
            result.push ( norm ( obj ) );
        } );
        result = _.sortBy( result, 'id' );
    } else if ( _.isObject( data ) ) {
        result = norm ( data );
    } else {
        result = data;
    }

    return result;
};

module.exports = function ( sequelize, ORMTimezoneModel ) {
    if ( TimezoneService && TimezoneService.instance ) {
        return TimezoneService.instance;
    }

    TimezoneService = require( 'services' ).BaseService.extend( {

        findById: function ( id ) {
            var deferred = Q.defer()
                , query = config.mongo ? { _id: id } : { where: { id: id } };

            this.find( query )
                .then( function ( result ) {
                    if ( !result ) {
                        return deferred.resolve( null );
                    }

                    deferred.resolve( normalize( result[0] ) );
                } )
                .fail( deferred.reject );

            return deferred.promise;
        },

        findByName: function ( name ) {
            var self = this
                , deferred = Q.defer()
                , query = config.mongo ? { name: name } : { where: { name: name } };

            self.find( query )
                .then( function ( result ) {
                    if ( !result ) {
                        return deferred.resolve( null );
                    }

                    deferred.resolve( normalize( result [ 0 ] ) );
                } )
                .fail( deferred.reject );

            return deferred.promise;
        },

        findByOffset: function ( offset ) {
            var deferred = Q.defer();

            if ( !arguments.length ) {
                deferred.resolve( errMs );
                return deferred.promise;
            }

            var obj = {
                offset: offset
            };

            var query = config.mongo ? obj : { where: obj };

            this.find( query )
                .then( function ( result ) {
                    if ( !result ) {
                        return deferred.reject( null );
                    }

                    deferred.resolve( normalize( result [ 0 ] ) );
                } )
                .fail( deferred.reject );

            return deferred.promise;
        },

        list: function ( ) {
            var deferred = Q.defer();

            this.findAll( )
                .then( function ( result ) {
                    if ( !result ) {
                        return deferred.reject( null );
                    }

                    deferred.resolve( normalize( result ) );
                } )
                .fail( deferred.reject );

            return deferred.promise;
        }

    } );

    TimezoneService.instance = new TimezoneService( sequelize );
    TimezoneService.Model = ORMTimezoneModel;

    return TimezoneService.instance;
};
