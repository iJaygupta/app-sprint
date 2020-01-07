const Connections = require('../../models/connections');
const User = require('../../models/user');


exports.connections = function (utils) {

    return {

        getConnections: (request, response) => {
            let user_id = request.headers.payload.id;
            Connections.getModel().find({ user_id: user_id }).populate("contact_list").exec().then((data) => {
                utils.sendResponse(response, false, 200, 4028, data);
            }).catch((error) => {
                utils.sendResponse(response, true, 500, 1000);
            })
        },

        getActiveConnections: (request, response) => {
            let email = request.headers.payload.email || ""
            Connections.getModel().find({ email: email, isAvailable: true }).then((data) => {
                utils.sendResponse(response, false, 200, 4022, data);
            }).catch((error) => {
                utils.sendResponse(response, true, 500, 1000);
            })
        },

        addConnection: function (request, response) {
            let connections = request.body;
            let id = request.headers.payload.id;

            User.getModel().insertMany(connections).then((result) => {
                let connection_ids = [];
                if (result && Array.isArray(result)) {
                    result.forEach(element => {
                        connection_ids.push(element._id);
                    });
                    let param = {
                        user_id: id,
                        contact_list: connection_ids
                    }
                    Connections.getModel().insertMany(param).then((data) => {
                        utils.sendResponse(response, false, 200, 4027);
                    })
                }
            }).catch((error) => {
                utils.sendResponse(response, true, 500, 1000);
            })
        },
        deleteConnection: (request, response) => {
            let user_id = request.headers.payload.id;
            let param = request.params.id;
            console.log(user_id)
            var query = {};
            query = { $pull: { "contact_list": param } };
            console.log(query)


            Connections.getModel().updateOne({ user_id: user_id }, query).then((data) => {
                utils.sendResponse(response, false, 200, 4029);
            }).catch((error) => {
                utils.sendResponse(response, true, 500, 1000);
            })
        },
        updateConnections: (request, response) => {
            Connections.getModel().updateOne().then((updated) => {
            }).catch((error) => {
            });
        },
        blockConnection: (request, response) => {
            console.log("blockConnection trig");
        }

    }

}


