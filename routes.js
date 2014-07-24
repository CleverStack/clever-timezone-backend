module.exports = function( app, TimezoneController ) {
    // Define routes here
    app.all('/timezone/:action/:id?', TimezoneController.attach());
    app.all('/timezone/?:action?', TimezoneController.attach());
}
