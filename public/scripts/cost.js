/*
 * @Author: Abhinav Kushwaha <akush2007@gmail.com>
 *
 */

window.chanakya = window.chanakya || {};
(function($) {

    // get city http://maps.googleapis.com/maps/api/geocode/json?latlng=12.9667,77.5667
    // chanakya.Map.Details.source
    //  var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=12.9667,77.5667';
    //  $.ajax({
    //    type: 'GET',
    //    url: url,
    //    async: false,
    //    contentType: "application/json",
    //    dataType: 'jsonp'
    //  });
    //
    window.chanakya.currentCity = "bengaluru";
    window.chanakya.cabrates = {
        ola: {
            "mumbai": {
                mini: {
                    minprice: 100,
                    minkm: 4,
                    rate: 15
                },
                sedan: {
                    minprice: 150,
                    minkm: 4,
                    rate: 21
                },
                prime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 17
                },
                airportmini: {
                    minprice: 100,
                    minkm: 4,
                    rate: 15
                },
                airportsedan: {
                    minprice: 150,
                    minkm: 4,
                    rate: 21
                },
                airportprime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 17
                }
            },
            "bengaluru": {
                mini: {
                    minprice: 100,
                    minkm: 6,
                    rate: 10
                },
                sedan: {
                    minprice: 150,
                    minkm: 8,
                    rate: 13
                },
                prime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 18
                },
                airportmini: {
                    minprice: 540,
                    minkm: 30,
                    rate: 13,
                    toll: 75
                },
                airportsedan: {
                    minprice: 600,
                    minkm: 30,
                    rate: 16,
                    toll: 75
                },
                airportprime: {
                    minprice: 800,
                    minkm: 30,
                    rate: 18,
                    toll: 75
                }
            },
            "pune": {
                mini: {
                    minprice: 100,
                    minkm: 5,
                    rate: 12
                },
                sedan: {
                    minprice: 100,
                    minkm: 6,
                    rate: 18
                },
                prime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 18
                },
                airportmini: {
                    minprice: 100,
                    minkm: 5,
                    rate: 12
                },
                airportsedan: {
                    minprice: 100,
                    minkm: 5,
                    rate: 12
                },
                airportprime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 18
                }
            },
            "chennai": {
                mini: {
                    minprice: 100,
                    minkm: 5,
                    rate: 12
                },
                sedan: {
                    minprice: 150,
                    minkm: 6,
                    rate: 16
                },
                prime: {
                    minprice: 150,
                    minkm: 5,
                    rate: 18
                },
                pink: {
                    minprice: 150,
                    minkm: 5,
                    rate: 18
                },
                airportmini: {
                    minprice: 100,
                    minkm: 4,
                    rate: 15
                },
                airportsedan: {
                    minprice: 150,
                    minkm: 4,
                    rate: 21
                },
                airportprime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 17
                }
            },
            "goa": {
                sedan: {
                    minprice: 250,
                    minkm: 6,
                    rate: 15
                }
            },
            "jaipur": {
                mini: {
                    minprice: 49,
                    minkm: 3,
                    rate: 10
                },
                sedan: {
                    minprice: 99,
                    minkm: 5,
                    rate: 14
                },
                prime: {
                    minprice: 200,
                    minkm: 5,
                    rate: 18
                }
            },
            "hyderabad": {
                mini: {
                    minprice: 100,
                    minkm: 4,
                    rate: 10
                },
                sedan: {
                    minprice: 150,
                    minkm: 6,
                    rate: 14
                },
                airportmini: {
                    minprice: 499,
                    minkm: 30,
                    rate: 12
                },
                airportsedan: {
                    minprice: 600,
                    minkm: 30,
                    rate: 16
                }
            },
            "chandigarh": {
                mini: {
                    minprice: 49,
                    minkm: 3,
                    rate: 10
                },
                sedan: {
                    minprice: 99,
                    minkm: 5,
                    rate: 14
                }
            },
            "ahmedabad": {
                mini: {
                    minprice: 49,
                    minkm: 3,
                    rate: 10
                },
                sedan: {
                    minprice: 100,
                    minkm: 4,
                    rate: 12
                }
            },
            "surat": {
                mini: {
                    minprice: 49,
                    minkm: 3,
                    rate: 12
                },
                sedan: {
                    minprice: 49,
                    minkm: 2,
                    rate: 14
                }
            },
            "mysore": {
                mini: {
                    minprice: 49,
                    minkm: 2,
                    rate: 12
                },
                sedan: {
                    minprice: 49,
                    minkm: 2,
                    rate: 14
                }
            }
        },
        tfs: {
            "bangalore": {
                nano: {
                    minprice: 25,
                    minkm: 2,
                    rate: 10
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 16
                },
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                airporthatchback: {
                    minprice: 650,
                    minkm: 30,
                    rate: 14
                },
                airportsedan: {
                    minprice: 700,
                    minkm: 30,
                    rate: 16
                }
            },
            "chennai": {
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 15
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 16
                },
                suv: {
                    minprice: 300,
                    minkm: 8,
                    rate: 18
                }
            },
            "delhi": {
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                sedan: {
                    minprice: 49,
                    minkm: 6,
                    rate: 16
                }
            },
            "hyderabad": {
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                airporthatchback: {
                    minprice: 499,
                    minkm: 30,
                    rate: 12
                },
                airportsedan: {
                    minprice: 599,
                    minkm: 30,
                    rate: 14
                },
                airportsuv: {
                    minprice: 999,
                    minkm: 40,
                    rate: 16
                }
            },
            "jaipur": {
                hatchbacksedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 10
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                },
                airporthatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 10
                },
                airportsedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                }
            },
            "mumbai": {
                hatchbacksedan: {
                    minprice: 150,
                    minkm: 6,
                    rate: 15
                },
                sedan: {
                    minprice: 150,
                    minkm: 6,
                    rate: 18
                },
                suv: {
                    minprice: 200,
                    minkm: 6,
                    rate: 21
                },
                airporthatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 10
                },
                airportsedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                },
                airportsuv: {
                    minprice: 200,
                    minkm: 6,
                    rate: 21
                }
            },
            "pune": {
                eeco: {
                    minprice: 49,
                    minkm: 4,
                    rate: 13
                },
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 16
                },
                airporteeco: {
                    minprice: 49,
                    minkm: 4,
                    rate: 13
                },
                airporthatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                airportsedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 16
                }
            },
            "chandigarh": {
                mini: {
                    minprice: 49,
                    minkm: 3,
                    rate: 10
                },
                sedan: {
                    minprice: 99,
                    minkm: 5,
                    rate: 14
                }
            },
            "ahmedabad": {
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                airporthatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                },
                airportsedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                }
            },
            "surat": {
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                airportsuv: {
                    minprice: 300,
                    minkm: 8,
                    rate: 16
                },
                airportsedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                airporthatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 12
                }
            },
            "mysore": {
                hatchback: {
                    minprice: 49,
                    minkm: 4,
                    rate: 14
                },
                sedan: {
                    minprice: 49,
                    minkm: 4,
                    rate: 16
                },
                suv: {
                    minprice: 90,
                    minkm: 4,
                    rate: 18
                },
                airporthatchback: {
                    minprice: 60,
                    minkm: 4,
                    rate: 16
                },
                airportsedan: {
                    minprice: 60,
                    minkm: 4,
                    rate: 16
                },
                airportsuv: {
                    minprice: 90,
                    minkm: 4,
                    rate: 18
                }
            }
        },
        meru: {
            "bangalore": {
                flexi: {
                    minprice: 80,
                    minkm: 4,
                    rate: 19.50
                },
                genie: {
                    minprice: 90,
                    minkm: 4,
                    rate: 10
                }

            },
            "delhi": {
                flexi: {
                    minprice: 69,
                    minkm: 3,
                    rate: 23
                },
                genie: {
                    minprice: 90,
                    minkm: 4,
                    rate: 10
                }
            },
            "pune": {
                flexi: {
                    minprice: 99,
                    minkm: 4,
                    rate: 15
                },
                genie: {
                    minprice: 90,
                    minkm: 6,
                    rate: 12
                }
            },
            "hyderabad": {
                flexi: {
                    minprice: 40,
                    minkm: 2,
                    rate: 21
                },
                genie: {
                    minprice: 90,
                    minkm: 4,
                    rate: 10
                }
            },
            "jaipur": {
                flexi: {
                    minprice: 99,
                    minkm: 5,
                    rate: 10
                }
            },
            "ahmedabad": {
                flexi: {
                    minprice: 100,
                    minkm: 6,
                    rate: 15
                },
                genie: {
                    minprice: 49,
                    minkm: 4,
                    rate: 10
                }
            },
            "chennai": {
                flexi: {
                    minprice: 90,
                    minkm: 4,
                    rate: 15
                },
                genie: {
                    minprice: 90,
                    minkm: 4,
                    rate: 10
                }
            },
            "mysore": {
                flexi: {
                    minprice: 49,
                    minkm: 2,
                    rate: 14
                },
                genie: {
                    minprice: 49,
                    minkm: 2,
                    rate: 12
                }
            },
            "kolkata": {
                flexi: {
                    minprice: 150,
                    minkm: 6,
                    rate: 15
                }
            }
        }
    };

    window.chanakya.cost = (function() {
        var rates = (function() {
            var auto = function() {
                if (chanakya.currentCity === "bengaluru")
                    return 13;
                else return 10;
            }
            var ola = function(type) {
                var rate = chanakya.cabrates.ola[chanakya.currentCity][type].rate || -1;
                return rate;
            }
            var tfs = function(type) {
                var rate = chanakya.cabrates.ola[chanakya.currentCity][type].rate || -1;
                return rate;
            }
            return {
                auto: auto,
                ola: ola,
                tfs: tfs
            };
        })();

        var auto = function(dist) {
            if (dist <= 1.9) return 25;
            return dist * rates.auto();
        }
        var ola = function dist(dist, type) {
            if (type === "auto") {
                return auto(dist);
            }
            if (dist <= chanakya.cabrates.ola[chanakya.currentCity][type].minkm)
                return chanakya.cabrates.ola[chanakya.currentCity][type].minprice;
            return chanakya.cabrates.ola[chanakya.currentCity][type].minprice + (dist - chanakya.cabrates.ola[chanakya.currentCity][type].minkm) * rates.ola(type);
        }
        var tfs = function dist(dist, type) {
            if (chanakya.currentCity === "bengaluru" && type === "auto") {
                return auto(dist);
            }
            if (dist <= chanakya.cabrates.tfs[chanakya.currentCity][type].minkm)
                return chanakya.cabrates.tfs[chanakya.currentCity][type].minprice;
            return chanakya.cabrates.ola[chanakya.currentCity][type].minprice + (dist - chanakya.cabrates.tfs[chanakya.currentCity][type].minkm) * rates.tfs(type);
        }
        var meru = function dist(dist, type) {
            if (dist <= chanakya.cabrates.meru[chanakya.currentCity][type].minkm)
                return chanakya.cabrates.meru[chanakya.currentCity][type].minprice;
            return chanakya.cabrates.meru[chanakya.currentCity][type].minprice + (dist - chanakya.cabrates.meru[chanakya.currentCity][type].minkm) * rates.meru(type);
        }
        var cheapest = function(dist) {
            var service = ["", 1000000];
            if (auto(dist) < service[1]) {
                service = ["auto", auto(dist)];
            }
            if (ola(dist, "mini") < service[1]) {
                service = ["ola", ola(dist, "mini")];
            }
            if (tfs(dist, "nano") < service[1]) {
                service = ["tfs", tfs(dist, "nano")];
            }
            return service;
        }
        return {
            auto: auto,
            ola: ola,
            tfs: tfs,
            cheapest: cheapest
        };
    })();
})(jQuery);
