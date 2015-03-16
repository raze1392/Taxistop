/*
 * @Author: Abhinav Kushwaha <akush2007@gmail.com>
 *
 */
(function(w, $, crypto, undefined) {
    w.chanakya = w.chanakya || {};
    w.chanakya.cost = (function() {
        var rates = {};
        var cityCodes = {};
        var currentCity = "";

        var update = function() {
            var token = chanakya.user.info().ratesauth.token;
            var city = _l(chanakya.Map.getSourceCity());
            if (!cityCodes.hasOwnProperty(city))
                getCityCode(city, token);
            else
                currentCity = city;
        };

        function getCityCode(city, token) {
            $.ajax({
                url: "https://taxistop-rates.firebaseio.com/cities/" + city + ".json?auth=" + token,
                jsonp: "updateCity",
                success: function(cityCode) {
                    if (cityCode === null) {
                        console.log("City not supported.");
                    } else if (rates.hasOwnProperty(cityCode)) {
                        console.log('Already fetched.');
                    } else {
                        currentCity = city;
                        cityCodes[currentCity] = cityCode;
                        getCabRates(cityCode, token);
                    }
                }
            });
        }

        function getCabRates(cityCode, token) {
            $.ajax({
                url: "https://taxistop-rates.firebaseio.com/rates/" + cityCode + ".json?auth=" + token,
                jsonp: "updateRates",
                success: function(resp) {
                    rates[cityCode] = resp;
                }
            });
        }

        var calculate = function(service, type, distance, airport, later) {
            if (!getRates().hasOwnProperty('now'))
                return -1;
            // TODO : logic here
            return 10;
        };

        var getRates = function() {
            return currentCity ? rates[cityCodes[currentCity]] : {};
        };

        return {
            calculate: calculate,
            update: update,
            getRates: getRates
        };
    }());
})(window, jQuery, CryptoJS);
