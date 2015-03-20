var ENV = process.env.NODE_ENV;

var Firebase = {};
Firebase.dbs = {
    prod: {
        login: {
            url: "https://taxistop.firebaseio.com",
            auth: "vVBHenEDBFihTCpkoADAyFbQaG1AtbsuXEROsi6g"
        }
    },
    dev: {
        login: {
            url: "https://vivid-inferno-8339.firebaseio.com",
            auth: "4fbWFdEsKHSwkNG6xDikveNBMnSBbYGPlkn4QSNG"
        }
    },
    common: {
        rates: {
            url: "https://taxistop-rates.firebaseio.com",
            auth: "cogYDhJs5DhOXMcDIF2YrdsSkk5Eivx4vLli2K1d"
        },
        cab: {
            url: "https://flickering-inferno-5036.firebaseio.com/",
            auth: "QbJrI593zkc2pvfQnHNIXsrNfgIUSR8MlOGVpRIq"
        }
    }
};

Firebase.config = {
    options: {
        port: 80,
        method: 'GET',
        headers: {
            
        }
    }
};

Firebase.buildPath = function(type, path) {
	var db = {};
	if (Firebase.dbs.common.hasOwnProperty(type))
		db = Firebase.dbs.common[type];
	else if (ENV === 'production')
		db = Firebase.dbs.prod[type];
	else
		db = Firebase.dbs.dev[type];
    return db.url + path + ".json?auth=" + db.auth;
};

module.exports = Firebase;