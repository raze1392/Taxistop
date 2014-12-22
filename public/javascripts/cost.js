/*
 * @Author: Abhinav Kushwaha <akush2007@gmail.com>
 * 
 */

window.chanakya = window.chanakya || {};
(function ($) {

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

  window.chanakya.cost = (function () {
    var rates = (function () {
      var city = "Bengaluru";
      var auto = function () {
        if (city === "Bengaluru")
          return 13;
        else return 10;
      }
      var ola = function (type) {
        if (city === "Bengaluru") {
          if (type === "mini") return 10;
          if (type === "sedan") return 13;
          if (type === "prime") return 18;
          if (type === "airportmini") return 13;
          if (type === "airportsedan") return 16;
          if (type === "airportprime") return 18;
          return -1;
        }
        return -1;
      }
      var tfs = function (type) {
        if (city === "Bengaluru") {
          if (type === "nano") return 10;
          if (type === "indica") return 14;
          if (type === "sedan") return 16;
          // TODO: for airport
          //          if (type === "airportmini") return 13;
          //          if (type === "airportsedan") return 16;
          //          if (type === "airportprime") return 18;
          return -1;
        }
        return -1;
      }
      return {
        auto: auto,
        ola: ola,
        tfs: tfs
      };
    })();

    var auto = function (dist) {
      if (dist <= 1.9) return 25;
      return dist * rates.auto();
    }
    var ola = function dist(dist, type) {
      if (type === "mini") {
        if (dist <= 6) return 100;
        return 100 + (dist - 6) * rates.ola(type);
      }
      if (type === "sedan") {
        if (dist <= 8) return 150;
        return 150 + (dist - 6) * rates.ola(type);
      }
      if (type === "prime") {
        if (dist <= 5) return 200;
        return 200 + (dist - 5) * rates.ola(type);
      }
      if (type === "airportmini") {
        if (dist <= 30) return 540;
        return 540 + (dist - 30) * rates.ola(type);
      }
      if (type === "airportsedan") {
        if (dist <= 30) return 600;
        return 600 + (dist - 30) * rates.ola(type);
      }
      if (type === "airportprime") {
        if (dist <= 30) return 800;
        return 800 + (dist - 30) * rates.ola(type);
      }
      return -1;
    }
    var tfs = function dist(dist, type) {
      if (type === "nano") {
        if (dist <= 2) return 25;
        return 25 + (dist - 2) * rates.tfs(type);
      }
      if (type === "indica") {
        if (dist <= 4) return 49;
        return 49 + (dist - 4) * rates.tfs(type);
      }
      if (type === "sedan") {
        if (dist <= 4) return 49;
        return 49 + (dist - 4) * rates.tfs(type);
      }
      return -1;
    }
    var cheapest = function (dist) {
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