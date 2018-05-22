import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Stocks=new Mongo.Collection('stocks');

if (Meteor.isServer){
	Meteor.publish('stocks',()=>{
		return Stocks.find({})
	})
}

Meteor.methods({
	'stocks.insert'(datasets){
		check(datasets,Object);
		Stocks.insert({datasets})
	},
	'stocks.remove'(name){
		check(name,String);
		Stocks.remove({"datasets.label":name})
	}
})