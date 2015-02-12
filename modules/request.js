/**
 * REST request class
 *
 */
var http = require("http");
var https = require("https");
var logger = require(__dirname + '/../modules/log');

/**
 * getJSON: REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function(options, onResult, hack) {
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        if (res.statusCode == 200 || res.statusCode == 304) {
            try {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                    output += chunk;
                });
                res.on('end', function() {
                    // Meru returns JSON object inside as a serialized XML
                    if (hack && (hack === 'meru')) {
                        output = output.substring(output.indexOf('>{') + 1, output.lastIndexOf('}<') + 1);
                    }

                    var obj = null;
                    try {
                        obj = eval("(" + output + ")");
                    } catch (ex) {
                        logger.error(ex.getMessage, ex);
                    }

                    onResult(res.statusCode, obj);
                });
            } catch (ex) {
                logger.warn(ex.getMessage, ex);
                var output = {success: false};
                onResult(res.statusCode, output);
            }
        } else {
            var output = {success: false};
            onResult(res.statusCode, output);
        }
    });
    req.on('error', function(err) {
        console.log('Rest :: Error : ' + err);
    });
    req.end();
};
/**
 * postJSON: post a JSON object to a REST service
 *
 * @param options
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.postJSON = function(options, data, onResult) {
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            output += chunk;
        });
        res.on('end', function() {
            console.log('end: ' + output);
            var obj = eval("(" + output + ")");
            onResult(res.statusCode, obj);
        });
    });
    req.on('error', function(err) {
        console.log('error: ' + err.message);
    });
    req.write(JSON.stringify(data));
    req.end();
};
/**
 * deleteJSON: send a delete REST request with an id to delete
 *
 * @param options: http server options object
 * @param itemId: item id to delete
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.deleteJSON = function(options, itemId, onResult) {
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            output += chunk;
        });
        res.on('end', function() {
            var obj = eval("(" + output + ")");
            onResult(res.statusCode, obj);
        });
    });
    req.on('error', function(err) {
        // res.send('error: ' + err.message);
    });
    req.end();
};
