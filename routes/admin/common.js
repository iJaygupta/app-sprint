module.exports.common = function (app, controller, error, auth, middleware) {

    app.route("/admin/common/lookup/query").get(auth, function (request, response) {
        try {
            controller.getQueries(request, response);
        }
        catch (err) {
            error(err, response)
        }
    })
}