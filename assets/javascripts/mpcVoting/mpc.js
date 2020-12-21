(function (exports, node) {
    var saved_instance;
    var seeds = {};
  

     // Connect to the server and initialize the jiff instance
    exports.connect = function (hostname, computation_id, options) {
      var opt = Object.assign({}, options);
      opt.Zp = 29;
      opt.crypto_provider = true;
  
      if (node) {
        JIFFClient = require('/lib/jiff-client');
        $ = require('jquery-deferred');
      }
  
      saved_instance = new JIFFClient(hostname, computation_id, opt);
  
      return saved_instance;
    };
  

     // The MPC computation - Sharmir secret share
    exports.compute = function (inputs, jiff_instance) {
      if (jiff_instance == null) {
        jiff_instance = saved_instance;
      }
  
      if (seeds[jiff_instance.id] == null) {
        seeds[jiff_instance.id] = 0;
      }
      var seed = seeds[jiff_instance.id]++;
  
      var deferred = $.Deferred();
  
      jiff_instance.share_array(inputs).then(function (option_shares) {
        jiff_instance.seed_ids(seed);
  
        var results = option_shares[1];
        for (var j = 2; j <= jiff_instance.party_count; j++) {
          for (var i = 0; i < option_shares[j].length; i++) {
            results[i] = results[i].sadd(option_shares[j][i]);
          }
        }
  
        jiff_instance.open_array(results).then(function (results) {
          deferred.resolve(results);
        });
      });
  
      return deferred.promise();
    };
  }((typeof exports === 'undefined' ? this.mpc = {} : exports), typeof exports !== 'undefined'));