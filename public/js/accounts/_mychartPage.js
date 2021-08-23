let socket = io();

google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawChart);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    socket.emit('mychart-uid', uid);
  }
});

socket.on('mychart', (tablesObj) => {
  console.log('tablesObj: ', tablesObj)
  let selected = true;
  for (const [k, v] of Object.entries(tablesObj)) {
    new Promise(resolve => {
      const className = selected ? "nav-link active" : "nav-link";
      const className2 = selected ? "tab-pane fade show active" : "tab-pane fade";
  
      let temp = `<a class="${className}" id="${k}-tab" data-toggle="pill" href="#${k}" role="tab" aria-controls="${k}" aria-selected="${selected}">${k}</a>`;
      $(".nav").append(temp);
  
      console.log(v)
      console.log(Object.values(v));
      let temp_2 = `<div class="${className2}" id="${k}" role="tabpanel" aria-labelledby="${k}-tab">`;
      temp_2 += `<div id="${k}-chart"></div>`;
      temp_2 += `</div>`;
      $(".tab-content").append(temp_2);
      selected &&= false;

      console.log(document.getElementById(`${k}-chart`));
      resolve({k,v});
    })
    .then((data) => {
      const { k,v } = data;
      console.log(k, v);
      google.charts.setOnLoadCallback(() => {
        var data = google.visualization.arrayToDataTable([
          ['study', 'O', 'X'],
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
    
        var chart = new google.visualization.BarChart(document.getElementById(`${k}-chart`));
        chart.draw(data, options);
      });
    });
  }
});
