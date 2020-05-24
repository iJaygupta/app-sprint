module.exports = function (appUrl, chai, should, assert, models) {
    return [
        {
            description: "Add-Connections Case-1  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .post("user/add-connection")
                    .set('Authorization', process.env.token)
                    .send(models.connections.appConnections1.data)
                    .end(function (err, res) {
                        try {
                            res.should.have.status(200);
                            res.body.should.have.property('error', false);
                            res.body.should.have.property('msg');
                            res.body.should.have.property('code', 4027);
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                    });
            }
        },
        {
            description: "Add-Connections Case-2  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .post("user/add-connection")
                    .end(function (err, res) {
                        try {
                            res.should.have.status(401);
                            res.body.should.have.property('error', true);
                            res.body.should.have.property('msg');
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                    });
            }
        },
        {
            description: "Get-Connections Case-1  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .get("user/get-connections")
                    .set('Authorization', process.env.token)
                    .end(function (err, res) {
                        try {
                            res.should.have.status(200);
                            res.body.should.have.property('error', false);
                            res.body.should.have.property('msg');
                            res.body.should.have.property('code', 4028);
                            res.body.should.have.property('data');
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                    });
            }
        },
        {
            description: "Get-Connections Case-2  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .get("user/get-connections")
                    .end(function (err, res) {
                        try {
                            res.should.have.status(401);
                            res.body.should.have.property('error', true);
                            res.body.should.have.property('msg');
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                    });
            }
        },
        {
            description: "Get-Active-Connection Case-1  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .get("user/get-active-connections")
                    .set('Authorization', process.env.token)
                    .end(function (err, res) {
                        try {
                            res.should.have.status(200);
                            res.body.should.have.property('error', false);
                            res.body.should.have.property('msg');
                            res.body.should.have.property('code', 4028);
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                    });
            }
        },
        {
            description: "Get-Active-Connections Case-2  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .get("user/get-active-connections")
                    .end(function (err, res) {
                        try {
                            res.should.have.status(401);
                            res.body.should.have.property('error', true);
                            res.body.should.have.property('msg');
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                    });
            }
        },
        {
            description: "Delete-Connections Case-1  Connections-User-Controller",
            callback: function (done) {

                chai.request(appUrl)
                    .delete(`user/delete-connection/5ec67f64b236f717adadbb5e`)
                    .set('Authorization', process.env.token)
                    .end(function (err, res) {
                        try {
                            res.should.have.status(200);
                            res.body.should.have.property('error', false);
                            res.body.should.have.property('msg');
                            res.body.should.have.property('code', 4029);
                            done();
                        }
                         catch (error) {
                            done(error);
                        }
                        
                    });
            }
        },
    ];
};
