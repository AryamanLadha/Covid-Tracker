//import logo from './logo.svg';
import './App.css';
import {Component} from "react";
import Chart from "react-google-charts";

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}

class App extends Component {
  constructor(){
    super();
    this.state = 
    {
      data_array: [],
      fetched: false,
      states_wanted: false,
      state_name : "ca",
      state_array:{
        ca: { fetched: false, data: []}
      }
    };
  }

  async fetchStateData(state_name){
    var data_array = [];
    var now = new Date();
    var daysOfYear = [];
    for (var d = new Date(2020, 11, 31); d <= now; d.setDate(d.getDate() + 1)) { //In build version, set date to 2020, 0, 14
      //On the test version, use 2020, 11, 31
      var date = new Date(d);
      //console.log(date);
      var year = date.getFullYear().toString();
      var month = date.getMonth()+1;
      if(month>9){
        month = month.toString();
      }
      else{
        month = "0" + month.toString();
      }
      var day = date.getDate();
      if(day>9){
        day = day.toString();
      }
      else{
        day = "0" + day.toString();
      }

      var date_string = year + month + day;
      var request_string = 'https://api.covidtracking.com/v1/states/' +state_name+ "/" + date_string + '.json';
      daysOfYear.push(request_string);
    }
    for(var i = 0; i< daysOfYear.length; i++){
        try{
          var res = await fetch(daysOfYear[i]);
          var data = await res.json();
          console.log(data);
          data_array.push(data);
        }
        catch{
          console.log("F");
        }
    }
    var state_array = this.state.state_array;
    state_array.ca.data = data_array;
    state_array.ca.fetched = true;
    this.setState({
      state_array: state_array
    });
  }
  async changeFilter(name){
    if(name === "us"){
      this.setState({
        states_wanted: false,
      });
    }
    else{
      this.setState({
        states_wanted: true,
        state_name:  name
      });
      if(!this.state.state_array.ca.fetched){
        await this.fetchStateData(name);
      }
    }


  }
  async componentDidMount(){
    var data_array = [];
    var now = new Date();
    var daysOfYear = [];
    for (var d = new Date(2020, 11, 31); d <= now; d.setDate(d.getDate() + 1)) { //In build version, set date to 2020, 0, 14
      //On the test version, use 2020, 11, 31
      var date = new Date(d);
      //console.log(date);
      var year = date.getFullYear().toString();
      var month = date.getMonth()+1;
      if(month>9){
        month = month.toString();
      }
      else{
        month = "0" + month.toString();
      }
      var day = date.getDate();
      if(day>9){
        day = day.toString();
      }
      else{
        day = "0" + day.toString();
      }

      var date_string = year + month + day;
      var request_string = 'https://api.covidtracking.com/v1/us/' + date_string + '.json';
      daysOfYear.push(request_string);
    }
    for(var i = 0; i< daysOfYear.length; i++){
        try{
          var res = await fetch(daysOfYear[i]);
          var data = await res.json();
          console.log(data);
          data_array.push(data);
        }
        catch{
          console.log("F");
        }
    }
    this.setState({
      data_array : data_array,
      fetched: true,
    })

      //   .then(res => res.json())
      //   .then((data) => {
      //     console.log(data);
      //     data_array.push(data);
      //   })
      //   .catch(console.log)
      // }
    console.log(data_array.length);
  }
  render(){
    var display_data = []
    if(!this.state.fetched){
      return (<div> Loading Data</div>);
    }
    if(this.state.states_wanted){
      if(!this.state.state_array.ca.fetched){
        return (<div>Loading Data</div>);
      }
      else{
        display_data = this.state.state_array.ca.data;
      }
    }
    else{
      display_data = this.state.data_array;
    }
    var graph_total = []
    var graph_daily_new = []
    graph_total.push(['x', 'Total Cases'])
    graph_daily_new.push(['x', 'Daily New Cases'])
    var slide_begin;
    var slide_end;
    for(var i = 0; i< display_data.length-1; i++){
      //console.log(this.state.data_array)
      var u = display_data[i].date; //2020101
      var d = u.toString(); //"20200101"
      var yy = parseInt(d.substring(0,4)); //2020
      var mm = parseInt(d.substring(4,6))-1;  //01
      var dd = parseInt(d.substring(6,8));// 01
      //var format_date = yy+ "-" + mm + "-" +dd;// "2020-01-01"
      var x = new Date(yy,mm,dd);
      console.log(x);
      graph_daily_new.push([x,display_data[i].positiveIncrease]);
      graph_total.push([x,display_data[i].positive]);
      if(i === 0){
        slide_begin = x;
      }
      if(i === this.state.data_array.length-2){
        slide_end = x;
      }
    }
    var total_cases = display_data[display_data.length-2].positive;
    var new_cases = display_data[display_data.length-2].positiveIncrease;
    return (
      <div>
        <div>
          Total Cases as of Today: {numberWithCommas(total_cases)}
        </div>
        <div>
          New Cases today: {numberWithCommas(new_cases)}
        </div>
        <div>
          <button onClick= {async () => await this.changeFilter("ca")}> California</button>
          <button onClick= {async () => await this.changeFilter("us")}> Reset</button>
        </div>
      <div className="App">
        <Chart
          width={'600px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={graph_total}
          options={{
            hAxis: {
              title: 'Time',
            },
            vAxis: {
              title: 'Total cases',
            }
            // chartArea: { height: '400px', width: '600px' },
            // //hAxis: { slantedText: false },
            // vAxis: { viewWindow: { min: 0, max: 2000 } },
            // legend: { position: 'none' },
            //
          }}
          rootProps={{ 'data-testid': '1' }}
          // chartPackages={['corechart', 'controls']}
          // controls={[
          //   {
          //     controlType: 'ChartRangeFilter',
          //     options: {
          //       filterRowIndex: 0,
          //       ui: {
          //         chartType: 'LineChart',
          //         chartOptions: {
          //           chartArea: { width: '600px', height: '50px' },
          //           hAxis: { baselineColor: 'none' },
          //         },
          //       },
          //     },
          //     controlPosition: 'bottom',
          //     controlWrapperParams: {
          //       state: {
          //         range: { start: new Date(2020,11,31), end: new Date(2021,1,28) },
          //       },
          //     },
          //   },
          // ]}
        />
      </div>
      <div>
      <Chart
          width={'600px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={graph_daily_new}
          options={{
            hAxis: {
              title: 'Time',
            },
            vAxis: {
              title: 'Daily New Cases',
            },
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
      </div>
    );
  }
}

export default App;
