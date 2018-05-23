import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor'
import Chart from './chart.js';
import InputBox from './input.js';
import {Stocks} from '../api/stocks.js'
import { withTracker } from 'meteor/react-meteor-data';

class App extends Component {
	constructor(){
		super();
		this.state={labels:null,isFetched:false}
		this.renderApp=this.renderApp.bind(this);
		this.handleText=this.handleText.bind(this);
		this.fetchData=this.fetchData.bind(this);
		this.handleChange=this.handleChange.bind(this);
		this.handleRemove=this.handleRemove.bind(this);
	}
	componentDidMount(){
		this.options={
 			scales:{
	          xAxes:[{
	            gridLines:{
	              drawOnChartArea: false,
	              color:'#A70F01'
	            },
	            scaleLabel:{
	                display:true,
	                fontColor:'#340D09',
	                labelString:"Time (yyyy-mm)"
	            },
	            ticks:{
	              fontColor:'#A70F01',
	            }
	          }],
	          yAxes:
	          [{
            	scaleLabel:{
                	display:true,
	                labelString:"Value ($ Milion)",
	                fontColor:'#340D09',
              	},
              	ticks:{
	              fontColor:'#A70F01',
	            },	
              	gridLines:{
               	 	display: true,
               	 	drawOnChartArea: false,
               	 	color:'#A70F01'
              	}
	          }]
	        }
 		};
 		this.fetchData('fb');
	}

	getRandomColor() {
	  var letters = '0123456789ABCDEF';
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
	    color += letters[Math.floor(Math.random() * 16)];
	  }
	  return color;
	}

	fetchData(name){//should save only datasets
		name=name.toUpperCase();
		const url =`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${name}&apikey=NE3XFAJBB0Q21W8R`;
		fetch(url)
		.then(res=>res.json())
		.then(res=>{
			let xAxis=Object.keys(res["Monthly Time Series"]).slice(0,29).sort();//885
			let yAxis=xAxis.map(each=>{
				return Number(res["Monthly Time Series"][each]["4. close"])
			});
			const datasets={
					  data:yAxis,
			          label:res["Meta Data"]["2. Symbol"],
			          borderColor:this.getRandomColor(),
			          backgroundColor:'rgba(255, 255, 255, 0.1)',
			          borderWidth:2,
			          pointRadius:2
					};
			if (!this.state.labels){
				this.setState({labels:xAxis.map(each=>each.slice(0,7))})
			};
			return datasets
		}).then(datasets=>{
			if(this.state.isFetched){
				Meteor.call('stocks.insert',datasets);
			}
		})
		.catch(err=>{console.log(err)})
	}

	handleText(e){
		e.preventDefault();
		this.setState({isFetched:true})
		let text=e.target.textValue.value.toUpperCase();
		if (text===""){return }
		let labelList=this.props.stocks.map(each=>each.datasets.label);
		if(!labelList.includes(text)){
			this.fetchData(text);
			e.target.textValue.value="";
		}else{
			alert('chart already inserted')
		}
		
	}
	getData(){
		let data= {
			labels:this.state.labels,
			datasets:this.props.stocks.map(each=>each.datasets)
		}
		return data
	}
	handleChange(e){
		this.setState({textValue:e.target.value})
	}
	handleRemove(){
		let stock=this.state.textValue.toUpperCase();
		Meteor.call('stocks.remove',stock);
	}

	renderApp(){
			if(!this.state.labels){
				return (
						<div>Loading...</div>
				)
			}else{
			return (
				<div>
					<div style={{display:"flex",flexWrap:'wrap'}}>
						<div style={{flexGrow:6,maxWidth:'80%'}}>
							<Chart data={this.getData()}
							options={this.options}
							/>
						</div>
						<div style={{flexGrow:6}}>
							<p>User Story: I can view a graph displaying the recent trend lines for each added stock.</p>
							<p>User Story: I can add new stocks by their symbol name. (for example: FB, MSFT, AA, BB...)</p>
							<p>User Story: I can remove stocks.(enter a name into the box and click remove)</p>
							<p>User Story: I can see changes in real-time when any other user adds or removes a stock. </p>
						</div>
					</div>
					<InputBox handleText={this.handleText} handleChange={this.handleChange}/>
					<button onClick={this.handleRemove}>Remove</button>
				</div>
			)
		}
	}	

	render(){
		return (
			<div>
				{this.renderApp()}
			</div>
		)
	}
};

export default withTracker(()=>{
	Meteor.subscribe('stocks');
	return {
		stocks:Stocks.find({}).fetch(),
	}
})(App);