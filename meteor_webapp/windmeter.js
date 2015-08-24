if (Meteor.isServer) {
  var SparkApi = Meteor.npmRequire('spark');

  var lastSpeedMeasured = -1;

  function updateReading(data) {
    if (data && data.data>=0) Readings.update( { name:'kars'}, { $set: { speed: data.data, lastModified:new Date() }});
  }

  Meteor.startup(function() {

    var reading = Readings.findOne( { name:'kars' } );
    if (!reading) {
      Readings.insert( { name:'kars', speed:0.0, lastModified:new Date() } );
      Readings.findOne( { name:'kars' } );
    }

    SparkApi.on('login', function() {
         //Get all events
         SparkApi.getEventStream('windspeedAtKarsHouse', false, Meteor.bindEnvironment(function(data) {
             updateReading(data);
         }));
     });

    SparkApi.login({accessToken: 'your-access-token'});

  });
};


if (Meteor.isClient) {
  Template.windSpeed.helpers({
    'currentSpeed': function () {
      var reading = Readings.findOne( { name:'kars'} );
      if (reading) return reading.speed; else return '-';
    },
    'currentBft': function() {
      var reading = Readings.findOne( { name:'kars'} );
      if (reading) {
        var s = reading.speed;
        if (s<0.5) return 0;
        if (s<1.9) return 1;
        if (s<3.3) return 2;
        if (s<5.4) return 3;
        if (s<7.9) return 4;
        if (s<11.0) return 5;
        if (s<14.1) return 6;
        if (s<17.2) return 7;
        if (s<20.8) return 8;
        if (s<24.4) return 9;
        if (s<28.5) return 10;
        if (s<32.6) return 11;
        return 12;
      }
      return '-';
    }
  });
}

Readings = new Meteor.Collection("readings");
