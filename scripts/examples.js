angular.module('demo.examples', ['pretty'])

.factory('appUtils', function() {
  return {
    linearData: function(rowCount, seriesCount) {
      var data = [];

      for (var i = 0; i < seriesCount; i++) {
        for (var j = 0; j < rowCount; j++) {
          var row = data[j] || {x: j};
          row['val_' + i] = Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000;
          data[j] = row;
        }
      }
      
      return data;
    },
    
    logData: function(rowCount, seriesCount) {
      var data = [];

      for (var i = 0; i < seriesCount; i++) {
        for (var j = 0; j < rowCount; j++) {
          var row = data[j] || {foo: j};
          row['val_' + i] = (j+1)*100000 + parseInt(Math.cos(j)*200000);
          data[j] = row;
        
        }
      }
      
      return data;
    },
    
    timedData: function(rowCount, seriesCount) {
      var data = [];

      var t = new Date();
      t.setMonth(t.getMonth() - 1);
      t = t.getTime();

      for (var i = 0; i < seriesCount; i++) {
        for (var j = 0; j < rowCount; j++) {
          var row = data[j] || {x: new Date(t + j*3600*1000*24)};
          row['val_' + i] = Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000;
          data[j] = row;
        }
      }

      return data;
    }
  };
})

.controller('ExamplesCtrl', function($scope, appUtils) {
  mixpanel.track("Examples");
  var colors = d3.scale.category10();
  $scope.max = 100;
  
  var linData = appUtils.linearData($scope.max, 4);
  var timData = appUtils.timedData($scope.max, 4);
  var logData = appUtils.logData($scope.max, 4);
  
  $scope.crop = function(example) {
    mixpanel.track("Cropping data", {example: example.label, rows: example.visibleRows});
    example.data = example.originData.slice(0, example.visibleRows);
  };
  
  $scope.examples = [
    {
      label: 'Linear series',
      description: 'Standard linear data is fully supported and can be displayed as lines, columns and areas.',
      originData: linData,
      visibleRows: 100,
      data: linData.slice(0, 100),
      options: {series: [
        {y: 'val_0', label: 'A line sinusoid', color: colors(0)},
        {y: 'val_0', label: 'A column sinusoid', color: colors(1), type: 'column'},
        {y: 'val_0', label: 'An area sinusoid', color: colors(2), type: 'area'}
      ]}
    },
    
    {
      label: 'Log series',
      description: 'Vertical axes can be configured as logarithmic axes. This is convenient to display wide-range data.',
      originData: logData,
      visibleRows: 100,
      data: logData.slice(0, 100),
      options: {axes: {x: {key: 'foo', labelFunction: function(v) {return 'Na';}}, y: {type: 'log'}},
        series: [{y: 'val_0', label: 'Batmaaan', color: colors(4)}]
      }
    },

    {
      label: 'Time series',
      description: 'Date objects are also accepted as abscissas values.',
      originData: timData,
      visibleRows: 100,
      data: timData.slice(0, 100),
      options: {axes: {
        x: {type: 'date', tooltipFormatter: function(d) {return moment(d).fromNow();}}
      },
      series: [{y: 'val_0', label: 'A time series', color: colors(9)}]}
    },

    {
      label: 'Area series',
      originData: linData,
      visibleRows: 100,
      data: linData.slice(0, 100),
      description: 'Area series are fully supported.',
      options: {series: [{y: 'val_0', label: 'A colorful area series', color: colors(1), type: 'area'}]}
    },

    {
      label: 'Column series',
      originData: linData,
      visibleRows: 100,
      data: linData.slice(0, 100),
      description: 'Column series are fully supported too. The chart adjusts its x-axis so that columns are never cropped.',
      options: {series: [{y: 'val_0', label: 'The best column series ever', color: colors(2), type: 'column'}]}
    },

    {
      label: 'Two axes',
      originData: linData,
      visibleRows: 100,
      data: linData.slice(0, 100),
      description: 'Series can be represented on another axis, just say it in the options !',
      options: {series: [
        {y: 'val_0', label: 'On the left !', color: colors(3)},
        {y: 'val_1', axis: 'y2', label: 'On the right !', color: colors(4)}
      ]}
    },

    {
      label: 'Interpolation',
      originData: linData,
      visibleRows: 100,
      data: linData.slice(0, 100),
      description: 'D3.js adds some eye-candy when asked, and it is awesome.',
      options: {lineMode: 'bundle', series: [
      {y: 'val_0', label: 'Ping', color: colors(5)},
      {y: 'val_2', label: 'Pong', axis: 'y2', color: colors(6)}
      ]}
    },

    {
      label: 'Several series',
      originData: linData,
      visibleRows: 100,
      data: linData.slice(0, 100),
      description: 'You can mix series types, n3-charts handles the rest.',
      options: {lineMode: 'cardinal', series: [
      {y: 'val_0', label: 'This', type: 'area', color: colors(7)},
      {y: 'val_1', label: 'Is', type: 'column', color: colors(8)},
      {y: 'val_2', label: 'Awesome', color: colors(9)}
      ]}
    },

    {
      label: 'Striped areas',
      originData: linData,
      visibleRows: 10,
      data: linData.slice(0, 10),
      description: 'Stripes are useless. But they\'re also awesome. Because, you know... stripes.',
      options: {lineMode: 'cardinal', series: [
      {y: 'val_0', label: 'Stripes', type: 'area', striped: true, color: colors(10)},
      {y: 'val_1', label: 'Are', type: 'area', striped: true, color: colors(14)},
      {y: 'val_2', label: 'Sweet', type: 'area', striped: true, color: colors(18)}
      ]}
    },

    {
      label: 'A last one',
      originData: linData,
      visibleRows: 10,
      data: linData.slice(0, 10),
      description: 'This one has no particular purpose.',
      options: {lineMode: 'cardinal', series: [
      {y: 'val_0', label: 'Rowdy', type: 'area', striped: true, color: colors(10)},
      {y: 'val_1', label: 'Eagle', type: 'area', striped: true, color: colors(14)},
      ]}
    }
  ];

  $scope.miniExamples = $scope.examples.map(function(e) {
    return {
      options: e.options,
      data: e.data.slice(0, 10)
    };
  });
});
