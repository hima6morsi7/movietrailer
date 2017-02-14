"use strict";
var pjson = require('./package.json');
var fs = require('fs');
var ServerController = (function () {
    function ServerController() {
    }
    ServerController.prototype.info = function (req, res, next) {
        var info = {
            version: pjson.version,
            time: process.uptime()
        };
        res.send(info, { 'Content-Type': 'application/json; charset=utf-8' });
        next();
    };
    // swagger UI can only handle one scheme, so we have to fix the swagger.json
    ServerController.prototype.getFixedSwaggerJson = function (req, res, next) {
        fs.readFile('./public/swagger.json', 'utf8', function (err, file) {
            if (err) {
                res.send(500);
                return next();
            }
            if (~req.headers.host.indexOf('localhost:3000')) {
                file = file.replace('"https"', '"http"');
            }
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(file),
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.write(file);
            res.end();
            next(false);
        });
    };
    return ServerController;
}());
exports.ServerController = ServerController;
//# sourceMappingURL=server-controller.js.map