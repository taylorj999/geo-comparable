import React, { Component, createRef } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImage from './MapnikImage';
import AutocompleteDataComponent from './AutocompleteDataComponent';

import axios from 'axios';

var config = require('../config/config');

const API_KEY = config.client.api_key;

export default class PropertySearch extends Component {
  constructor(props) {
	super(props);
	this.state = {properties: []};
	this.doPropertySearch = this.doPropertySearch.bind(this);
  }
  
  requireNumeric(evt){
	evt.target.value = evt.target.value.replace(/[^0-9]/g,"");
  }
  
  doPropertySearch(evt){
	evt.preventDefault();

	var streetName = evt.target.elements.streetNameInput.value;
	var minPrice = evt.target.elements.minPriceInput.value;
	var maxPrice = evt.target.elements.maxPriceInput.value;
	
    axios.post("/api-propsearch", { apiKey: API_KEY, streetName: streetName, minPrice: minPrice, maxPrice: maxPrice })
    .then(res => {
      if (res.data.status === "success") {
    	this.state.properties = res.data.data;
    	this.setState(this.state);
      } else {
    	console.log("Error in API component, see server logs for details");
      }
    })
    .catch(function (error) {
    	console.log(error);
    });
  }
  
  render() {
	return(
      <div className="container">
		<div className="row">
		  <form onSubmit={this.doPropertySearch}>
		    <div className="form-row d-flex align-items-center">
		      <div className="col-6">
		        <div className="form-group">
		          <label htmlFor="streetNameInput">Street Name</label>
		          <AutocompleteDataComponent inputName="streetNameInput"/>
		        </div>
		      </div>
		      <div className="col">
		        <div className="form-group">
		          <label htmlFor="minPriceInput">Min. Price</label>
		          <input 
		           type="text" 
		           className="form-control" 
		           id="minPriceInput" 
		           placeholder="0" 
		           onChange={(e) => this.requireNumeric(e)}/>
		        </div>
	          </div>
		      <div className="col">
		        <div className="form-group">
		          <label htmlFor="maxPriceInput">Max. Price</label>
		          <input 
		           type="text" 
		           className="form-control" 
		           id="maxPriceInput" 
		           placeholder="500000"
		           onChange={(e) => this.requireNumeric(e)}/>
		        </div>
		      </div>
		      <div className="col">
		        <button type="submit" className="btn btn-primary">Search</button>
		      </div>
		    </div>
		  </form>
	    </div>
	    <div className="row">
	      <div className="container">
	        <div className="row">
	          <div className="col-6">
	            <PropertyDetailList properties={this.state.properties}/>
	          </div>
	          <div className="col-6">
	            <MapnikImage/>
	          </div>
	        </div>
	      </div>
	    </div>
	  </div>
	);
  }
}
