//import logo from './logo.svg';
import './App.css';
import {Component} from "react";
import Chart from "react-google-charts";
// import DropdownButton from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
// import Spinner from 'react-bootstrap/Spinner'
import Loader from 'react-loader-spinner';
function numberWithCommas(x) {
  if(x == null){
    return '-'
  }
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}
const dictionary = {
  'az':'Arizona',
  'al':'Alabama',
  'ak':'Alaska',
  'as':'American Samoa',
  'ar':'Arkansas',
  'ca':'California',
  'co':'Colorado',
  'ct':'Connecticut',
  'de':'Delaware',
  'dc':'District of Columbia',
  'fl':'Florida',
  'ga':'Georgia',
  'gu':'Guam',
  'hi':'Hawaii',
  'id':'Idaho',
  'il':'Illinois',
  'in':'Indiana',
  'ia':'Iowa',
  'ks': 'Kansas',
  'ky': 'Kentucky',
  'la': 'Louisiana',
  'me': 'Maine',
  'md': 'Maryland',
  'ma': 'Massachusetts',
  'mi': 'Michigan',
  'mn': 'Minnesota',
  'ms': 'Mississippi',
  'mo': 'Missouri',
  'mt': 'Montana',
  'ne':'Nebraska',
  'nv':'Nevada',
  'nh':'New Hampshire',
  'nj':'New Jersey',
  'nm': 'New Mexico',
  'ny': 'New York',
  'nc': 'North Carolina',
  'nd': 'North Dakota',
  'mp': 'Northern Mariana Islands',
  'oh': 'Ohio',
  'ok': 'Oklahoma',
  'or': 'Oregon',
  'pa': 'Pennsylvania',
  'pr': 'Puerto Rico',
  'ri': 'Rhode Island',
  'sc': 'South Carolina',
  'sd': 'South Dakota',
  'tn': 'Tennessee',
  'tx': 'Texas',
  'ut': 'Utah',
  'vt': 'Vermont',
  'va': 'Virginia',
  'vi': 'Virgin Islands',
  'wa': 'Washington',
  'wv': 'West Virginia',
  'wi': 'Wisconsin',
  'wy': 'Wyoming',
  'us' : 'United States'
};

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
        "al": { fetched: false, data: []},
        "ak": { fetched: false, data: []},
        "as": { fetched: false, data: []},
        "az": { fetched: false, data: []},
        "ar": { fetched: false, data: []},
        "ca": { fetched: false, data: []},
        "co": { fetched: false, data: []},
        "ct": { fetched: false, data: []},
        "de": { fetched: false, data: []},
        "dc": { fetched: false, data: []},
        "fl": { fetched: false, data: []},
        "ga": { fetched: false, data: []},
        "gu": { fetched: false, data: []},
        "hi": { fetched: false, data: []},
        "id": { fetched: false, data: []},
        "il": { fetched: false, data: []},
        "in": { fetched: false, data: []},
        "ia": { fetched: false, data: []},
        "ks": { fetched: false, data: []},
        "ky": { fetched: false, data: []},
        "la": { fetched: false, data: []},
        "me": { fetched: false, data: []},
        "md": { fetched: false, data: []},
        "ma": { fetched: false, data: []},
        "mi": { fetched: false, data: []},
        "mn": { fetched: false, data: []},
        "ms": { fetched: false, data: []},
        "mo": { fetched: false, data: []},
        "ne": { fetched: false, data: []},
        "nv": { fetched: false, data: []},
        "nh": { fetched: false, data: []},
        "nj": { fetched: false, data: []},
        "nm": { fetched: false, data: []},
        "ny": { fetched: false, data: []},
        "nc": { fetched: false, data: []},
        "nd": { fetched: false, data: []},
        "mp": { fetched: false, data: []},
        "oh": { fetched: false, data: []},
        "ok": { fetched: false, data: []},
        "or": { fetched: false, data: []},
        "pa": { fetched: false, data: []},
        "pr": { fetched: false, data: []},
        "ri": { fetched: false, data: []},
        "sc": { fetched: false, data: []},
        "sd": { fetched: false, data: []},
        "tn": { fetched: false, data: []},
        "tx": { fetched: false, data: []},
        "ut": { fetched: false, data: []},
        "vt": { fetched: false, data: []},
        "va": { fetched: false, data: []},
        "vi": { fetched: false, data: []},
        "wa": { fetched: false, data: []},
        "wv": { fetched: false, data: []},
        "wi": { fetched: false, data: []},
        "wy": { fetched: false, data: []},
      }
    };
  }

  async fetchStateData(state_name){
    var data_array = [];
    var now = new Date();
    var daysOfYear = [];
    for (var d = new Date(2020, 11, 31); d <= now; d.setDate(d.getDate() + 1)) { //In build version, set date to 2020, 3, 3
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
          var data = res.json();
          //console.log(data);
          data_array.push(data);
        }
        catch{
          //console.log("F");
        }
    }
    var state_array = this.state.state_array;
    state_array[state_name].data = data_array;
    state_array[state_name].fetched = true;
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
      if(!this.state.state_array[name].fetched){
        await this.fetchStateData(name);
      }
    }


  }
  async componentDidMount(){
    var data_array = [];
    var now = new Date();
    var daysOfYear = [];
    for (var d = new Date(2020, 11, 31); d <= now; d.setDate(d.getDate() + 1)) { //In build version, set date to 2020, 3, 3
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
          //console.log(data);
          data_array.push(data);
        }
        catch{
          //console.log("F");
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
    //console.log(data_array.length);
  }
  render(){
    var display_data = []
    var display_name = 'United States';
    if(!this.state.fetched){
      return (
        <Loader type="Puff" className="centered" color="#000000" height={80} width={80}/>
      );
    }
    if(this.state.states_wanted){
      var name = this.state.state_name;
      if(!this.state.state_array[name].fetched){
        return (
          <Loader type="Puff" className="centered" color="#000000" height={80} width={80}/>
        );
      }
      else{
        display_data = this.state.state_array[name].data;
      }
      display_name = dictionary[name];
    }
    else{
      display_data = this.state.data_array;
    }
    var display_date;
    var graph_total = []
    var graph_daily_new = []
    var graph_daily_deaths = []
    var graph_deaths = []
    graph_deaths.push(['x','Total Deaths']);
    graph_daily_deaths.push(['x','New Deaths']);
    graph_total.push(['x', 'Total Cases']);
    graph_daily_new.push(['x', 'New Cases']);
    var slide_begin;
    var slide_end;
    console.log(display_data);
    for(var i = 0; i< display_data.length-1; i++){
      //console.log(this.state.data_array)
      var u = display_data[i].date; //2020101
      if(u!=null){
      var d = u.toString(); //"20200101"
      var yy = parseInt(d.substring(0,4)); //2020
      var mm = parseInt(d.substring(4,6))-1;  //01
      var dd = parseInt(d.substring(6,8));// 01
      //var format_date = yy+ "-" + mm + "-" +dd;// "2020-01-01"
      var x = new Date(yy,mm,dd);
      //console.log(x);
      graph_daily_new.push([x,display_data[i].positiveIncrease]);
      graph_total.push([x,display_data[i].positive]);
      graph_daily_deaths.push([x,display_data[i].deathIncrease]);
      graph_deaths.push([x,display_data[i].death]);

      if(i === 0){
        // slide_begin = x;
      }
      if(i === this.state.data_array.length-1){
        console.log("Here");
        display_date = x.toString().substring(4,15);
        console.log(display_date);
        slide_end = x;
      }
    }
    }
    var total_hospitalized = display_data[display_data.length-1].hospitalizedCumulative;
    var new_hospitalized = display_data[display_data.length-1].hospitalizedIncrease;
    var deaths = display_data[display_data.length-1].death;
    var new_deaths = display_data[display_data.length-1].deathIncrease;
    var total_cases = display_data[display_data.length-1].positive;
    if(display_date == null){
      var tmp = new Date().toString();
      console.log(tmp);
      var y = tmp.substring(11,15); //2020
      var m = tmp.substring(4,7);  //01
      var p = tmp.substring(8,10);// 01
      display_date = p + '-' + m + '-' + y;
    } 
    console.log(display_date);
    if(total_cases == null){
      total_cases = "-";
      console.log("Exit");
    }
    var new_cases = display_data[display_data.length-1].positiveIncrease;
    return (
      <body>
        <header>
          <div class="s_container">
            <div id="branding">
              <h1>Covid-19 Tracker | Aryaman Ladha</h1>
            </div>     
            <nav>
              <ul>
                <li>Date: <div id="info">{display_date}</div></li>
                <li>Total U.S. Covid-19 Cases: <div id="info">{total_cases}</div></li>
              </ul>
            </nav>

          </div>
        </header>












      <div className="wrapper">
        <div className="left_column">
        <div className="graph_heading">{slide_end} </div>
        <span className="graph_heading">Total Cases </span>
        <Chart
          width={'800px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={graph_total}
          // options={{
          //   hAxis: {
          //     title: 'Time',
          //   },
          //   vAxis: {
          //     title: 'Total cases',
          //   }
            // chartArea: { height: '400px', width: '600px' },
            // //hAxis: { slantedText: false },
            // vAxis: { viewWindow: { min: 0, max: 2000 } },
            // legend: { position: 'none' },
            //
          //}}
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
        <span className="graph_heading"> Daily New Cases </span>
      <Chart
          width={'800px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={graph_daily_new}
          // options={{
          //   hAxis: {
          //     title: 'Time',
          //   },
          //   vAxis: {
          //     title: 'Daily New Cases',
          //   },
          // }}
          rootProps={{ 'data-testid': '1' }}
        />
        <span className="graph_heading"> Total Deaths </span>
      <Chart
          width={'800px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={graph_deaths}
          // options={{
          //   hAxis: {
          //     title: 'Time',
          //   },
          //   vAxis: {
          //     title: 'Total Deaths',
          //   },
          // }}
          rootProps={{ 'data-testid': '1' }}
        />
        <span className="graph_heading"> New Deaths </span>
      <Chart
          width={'800px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={graph_daily_deaths}
          // options={{
          //   hAxis: {
          //     title: 'Time',
          //   },
          //   vAxis: {
          //     title: 'New Deaths',
          //   },
          // }}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
      <div id="right_column">
        <div className="country heading">
          <u>{display_name}</u>
        </div>
        <div className="statistics">
        <div className="numbers">{numberWithCommas(total_cases)}</div>
        <div className="heading">Total cases</div> 
        <hr align='left'/>
        <div className="numbers">{numberWithCommas(new_cases)}</div> 
        <div className="heading">New cases</div>
        <hr align='left'/>
        <div className="numbers">{numberWithCommas(deaths)}</div>
        <div className="heading">Total deaths</div> 
        <hr align='left'/>
        <div className="numbers">{numberWithCommas(new_deaths)}</div> 
        <div className="heading">New deaths</div>  
        <hr align='left'/>
        <div className="numbers">{numberWithCommas(total_hospitalized)}</div> 
        <div className="heading">Total cumulative hosptalizations</div>
        <hr align='lwft'/>
        <div className="numbers">{numberWithCommas(new_hospitalized)}</div> 
        <div className="heading">New hosptalizations</div> 
        <hr align="left"/>
        </div>
        <button onClick= {async () => await this.changeFilter("al")}> Alabama</button>
        <button onClick= {async () => await this.changeFilter("ak")}> Alaska</button>
        <button onClick= {async () => await this.changeFilter("as")}> American Samoa</button>
        <button onClick= {async () => await this.changeFilter("az")}> Arizona</button>
        <button onClick= {async () => await this.changeFilter("ar")}> Arkansas</button>
        <button onClick= {async () => await this.changeFilter("ca")}> California</button>
        <button onClick= {async () => await this.changeFilter("co")}> Colorado</button>
        <button onClick= {async () => await this.changeFilter("ct")}> Connecticut</button>
        <button onClick= {async () => await this.changeFilter("de")}> Delaware</button>
        <button onClick= {async () => await this.changeFilter("dc")}> District of Columbia</button>
        <button onClick= {async () => await this.changeFilter("fl")}> Florida</button>
        <button onClick= {async () => await this.changeFilter("ga")}> Georgia</button>
        <button onClick= {async () => await this.changeFilter("gu")}> Guam</button>
        <button onClick= {async () => await this.changeFilter("hi")}> Hawaii</button>
        <button onClick= {async () => await this.changeFilter("id")}> Idaho</button>
        <button onClick= {async () => await this.changeFilter("il")}> Illinois</button>
        <button onClick= {async () => await this.changeFilter("in")}> Indiana</button>
        <button onClick= {async () => await this.changeFilter("ia")}> Iowa</button>
        <button onClick= {async () => await this.changeFilter("ks")}> Kansas</button>
        <button onClick= {async () => await this.changeFilter("ky")}> Kentucky</button>
        <button onClick= {async () => await this.changeFilter("la")}> Lousiana</button>
        <button onClick= {async () => await this.changeFilter("me")}> Maine</button>
        <button onClick= {async () => await this.changeFilter("md")}> Marlyand</button>
        <button onClick= {async () => await this.changeFilter("ma")}> Massachusetts</button>
        <button onClick= {async () => await this.changeFilter("mi")}> Michigan</button>
        <button onClick= {async () => await this.changeFilter("mn")}> Minnesota</button>
        <button onClick= {async () => await this.changeFilter("ms")}> Mississipi</button>
        <button onClick= {async () => await this.changeFilter("mo")}> Missouri</button>
        <button onClick= {async () => await this.changeFilter("mt")}> Montana</button>
        <button onClick= {async () => await this.changeFilter("ne")}> Nebraska</button>
        <button onClick= {async () => await this.changeFilter("nv")}> Nevada</button>
        <button onClick= {async () => await this.changeFilter("nm")}> New Mexico</button>
        <button onClick= {async () => await this.changeFilter("ny")}> New York</button>
        <button onClick= {async () => await this.changeFilter("nc")}> North Carolina</button>
        <button onClick= {async () => await this.changeFilter("nd")}> North Dakota</button>
        <button onClick= {async () => await this.changeFilter("mp")}> Northern Mariana Islands</button>
        <button onClick= {async () => await this.changeFilter("oh")}> Ohio</button>
        <button onClick= {async () => await this.changeFilter("ok")}> Oklahoma</button>
        <button onClick= {async () => await this.changeFilter("or")}> Oregon</button>
        <button onClick= {async () => await this.changeFilter("pa")}> Pennsylvania</button>
        <button onClick= {async () => await this.changeFilter("pr")}> Puerto Rico</button>
        <button onClick= {async () => await this.changeFilter("ri")}> Rhode Island</button>
        <button onClick= {async () => await this.changeFilter("sc")}> South Carolina</button>
        <button onClick= {async () => await this.changeFilter("sd")}> South Dakota</button>
        <button onClick= {async () => await this.changeFilter("tn")}> Tennessee</button>
        <button onClick= {async () => await this.changeFilter("tx")}> Texas</button>
        <button onClick= {async () => await this.changeFilter("ut")}> Utah</button>
        <button onClick= {async () => await this.changeFilter("vt")}> Vermont</button>
        <button onClick= {async () => await this.changeFilter("vi")}> Virginia</button>
        <button onClick= {async () => await this.changeFilter("wa")}> Washington</button>
        <button onClick= {async () => await this.changeFilter("wv")}> West Virgina</button>
        <button onClick= {async () => await this.changeFilter("wi")}> Wisconsin</button>
        <button onClick= {async () => await this.changeFilter("wy")}> Wyoming</button>
        <button onClick= {async () => await this.changeFilter("us")}> Reset</button>
      </div>
    </div>

    </body>
    );
  }
}

export default App;
