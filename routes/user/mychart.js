google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);

let socket = io();
socket.on('mychart', (data) => {
  console.log(data);
  google.charts.setOnLoadCallback(drawChart);
});


function drawChart() {
    // rows.map((row, index) => {

    // });
    var data = google.visualization.arrayToDataTable([
        ['City', '2010 Population', '2000 Population'],
        ['New York City, NY', 8175000, 8008000],
        ['Los Angeles, CA', 3792000, 3694000],
        ['Chicago, IL', 2695000, 2896000],
        ['Houston, TX', 2099000, 1953000],
        ['Philadelphia, PA', 1526000, 1517000]
      ]);

      var options = {
        title: 'Population of Largest U.S. Cities',
        chartArea: {width: '50%'},
        hAxis: {
          title: 'Total Population',
          minValue: 0
        },
        vAxis: {
          title: 'City'
        }
      };

      var chart = new google.visualization.BarChart(document.getElementById('day'));
      chart.draw(data, options);
}

// google.charts.load('current', {'packages':['corechart']});

// // Set a callback to run when the Google Visualization API is loaded.
// google.charts.setOnLoadCallback(drawChart);

// // Callback that creates and populates a data table,
// // instantiates the pie chart, passes in the data and
// // draws it.
// function drawChart() {

//   // Create the data table.
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'Topping');
//   data.addColumn('number', 'Slices');
//   data.addRows([
//     ['Mushrooms', 1],
//     ['Onions', 1],
//     ['Olives', 1],
//     ['Zucchini', 1],
//     ['Pepperoni', 2]
//   ]);

//   // Set chart options
//   var options = {'title':'How Much Pizza I Ate Last Night',
//                  'width':400,
//                  'height':300};

//   // Instantiate and draw our chart, passing in some options.
//   var chart = new google.visualization.PieChart(document.getElementById('day'));
//   chart.draw(data, options);
// }