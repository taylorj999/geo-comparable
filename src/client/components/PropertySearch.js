import React, { Component, createRef } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImage from './MapnikImage';
import AutocompleteDataComponent from './AutocompleteDataComponent';

import Pagination from './Pagination';

import axios from 'axios';

var config = require('../config/config');

const API_KEY = config.client.api_key;

export default class PropertySearch extends Component {
  constructor(props) {
	super(props);
	this.state = {properties: [], propCount: 0, currentPage: 1, streetName:null,minPrice:null,maxPrice:null};
	this.searchFormSubmit = this.searchFormSubmit.bind(this);
  }
  
  requireNumeric(evt){
	evt.target.value = evt.target.value.replace(/[^0-9]/g,"");
  }
  
  searchFormSubmit(evt) {
	evt.preventDefault();

	var streetName = evt.target.elements.streetNameInput.value;
	var minPrice = evt.target.elements.minPriceInput.value;
	var maxPrice = evt.target.elements.maxPriceInput.value;

	this.paginatePropertySearch(streetName,minPrice,maxPrice,1);
  }
  
  paginatePropertySearch(streetName,minPrice,maxPrice,pageNumber){
	let searchState = {streetName: null, minPrice: null, maxPrice: null};
	if (streetName!=null) { searchState.streetName = streetName; } else { searchState.streetName = this.state.streetName; }
	if (minPrice!=null) { searchState.minPrice = minPrice; } else { searchState.minPrice = this.state.minPrice; }
	if (maxPrice!=null) { searchState.maxPrice = maxPrice; } else { searchState.maxPrice = this.state.maxPrice; }
	
    if (searchState.streetName==null && searchState.minPrice==null && searchState.maxPrice==null) return;
	
    axios.post("/api-propsearch", { apiKey: API_KEY, streetName: searchState.streetName, 
    	                            minPrice: searchState.minPrice, maxPrice: searchState.maxPrice,
    	                            resultsPage: pageNumber})
    .then(res => {
      if (res.data.status === "success") {
    	let currentProperty = null;
    	if (res.data.data.length) { currentProperty = res.data.data[0].ogr_fid; }
    	this.setState({properties: res.data.data, propCount: res.data.count, currentProperty: currentProperty, 
    		           currentPage: pageNumber, streetName: searchState.streetName, 
    		           minPrice: searchState.minPrice, maxPrice: searchState.maxPrice});
      } else {
    	console.log("Error in API component, see server logs for details");
      }
    })
    .catch(function (error) {
    	console.log(error);
    });
  }
  
  handlePageChange(pageNumber) {
	  this.paginatePropertySearch(null,null,null,pageNumber);
  }
  
  updateMap(propertyId) {
	  this.setState({currentProperty:propertyId});
  }
  
  render() {
	return(
      <div className="container">
		<div className="row">
		  <form onSubmit={this.searchFormSubmit}>
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
	            {function(){
	            	if(this.state.propCount > 0) {
	            	  try {
	            	    var paginationKey = this.state.streetName + "-" + this.state.minPrice + "-" + this.state.maxPrice;
	            	    console.log(paginationKey);
	            	    return <Pagination
	                            key={paginationKey}
	                            pageLimit={10}
	                            totalRecords={this.state.propCount}
	                            pageRange={3}
	                            onPageChange={this.handlePageChange.bind(this)}/>
	            	  } catch (e) { }
	            	}
	            }.bind(this)()}
	            <PropertyDetailList properties={this.state.properties} mapFunction={this.updateMap.bind(this)} currentProperty={this.state.currentProperty}/>
	          </div>
	          <div className="col-6">
	          {function(){
                if( this.state.currentProperty ) {
                  let imgKey = this.state.currentProperty;
                  return <MapnikImage propertyId={this.state.currentProperty} key={imgKey}/>
                } else {
                  return null;	
                }
	          }.bind(this)()}
	          </div>
	        </div>
	      </div>
	    </div>
	  </div>
	);
  }
}
