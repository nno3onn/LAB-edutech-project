let socket = io();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const user = firebase.auth().currentUser;
    socket.emit('mychart-uid', user.uid);
  }
});

console.log(window.location.href.split('/')[5]);
socket.emit('mychart-dbname', window.location.href.split('/')[5]); 

socket.on('mychart', (tablesObj) => {
  console.log('tablesObj: ', tablesObj);
  if (document.getElementsByClassName("tab-pane").length !== 0) return;

  const len = Object.keys(tablesObj).length; // 전체 table 수

  for (let i=1; i<=len; i++) { // table 끝에 숫자 순서대로 테이블 읽어오기
    const tableKey = `${Object.keys(tablesObj)[0].slice(0,-1)}${i}`
    const tableObj = tablesObj[tableKey];
    
    // nav tab
    let selected = i===1 ? true : false;

    const className = selected ? "nav-link active" : "nav-link";
    const className2 = selected ? "tab-pane fade show active" : "tab-pane fade";
    let temp = `<a class="${className}" id="${tableKey}-tab" data-toggle="pill" href="#${tableKey}" role="tab" aria-controls="${tableKey}" aria-selected="${selected}">${tableKey}</a>`;
    $(".nav").append(temp);

    let temp_2 = `<div class="${className2}" id="${tableKey}" role="tabpanel" aria-labelledby="${tableKey}-tab">`;
    for (const i in tableObj) {
      temp_2 += `<div id="${tableKey}-${i}"></div>`;
    }
    temp_2 += `</div>`;

    $(".tab-content").append(temp_2);
    selected &&= false;


    for (const [key, value] of Object.entries(tableObj)) {
      console.log(tableObj, key,value)
      
      google.charts.load('current', {packages: ['corechart', 'bar']});
      google.charts.setOnLoadCallback(() => {
        let arr = new Array();
        arr.push(['study', 'study-O', 'study-X', 'quiz-O', 'quiz-X']);
        for (let v of value) {
          arr.push([v.h1, v.so, v.sx, v.qo, v.qx]);
        }

        var data = google.visualization.arrayToDataTable(arr);
        var options = {
          title: key,
          width : 1000, // 가로 px
          height : 300 + value.length * 30, // 세로 px
          bar: { groupWidth: "75%" }, // 그래프 너비 설정 %
          hAxis: {minValue: 0},
          // bars: 'horizontal'
        };
        var chart = new google.visualization.BarChart(document.getElementById(`${tableKey}-${key}`));
        chart.draw(data, options);
      });
    }
  }
});
