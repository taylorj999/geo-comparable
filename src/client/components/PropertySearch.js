import React, { Component, createRef } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImageContainer from './MapnikImageContainer';
import AutocompleteDataComponent from './AutocompleteDataComponent';

import Pagination from './Pagination';

import axios from 'axios';

var config = require('../config/config');

const API_KEY = config.client.api_key;

export default class PropertySearch extends Component {
  constructor(props) {
	super(props);
	this.state = {properties: [], propCount: 0, currentPage: 1, 
			      streetName:null,
			      minPrice:null,
			      maxPrice:null,
			      errorMessage:null};
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
    	let errorMessage = null;
    	let errorType = null;
    	if (res.data.data.length) { currentProperty = res.data.data[0].ogr_fid; }
    	else { errorMessage = "No property results found."; errorType = "warning"; }
    	this.setState({properties: res.data.data, propCount: res.data.count, currentProperty: currentProperty, 
    		           currentPage: pageNumber, streetName: searchState.streetName, 
    		           minPrice: searchState.minPrice, maxPrice: searchState.maxPrice, errorMessage: errorMessage,
    		           errorType: errorType});
      } else {
    	console.log("Error in API component, see server logs for details");
    	this.setState({errorMessage:"An API error occurred. Please try again.",errorType:"error"});
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
      <div className="container" id="propertySearch">
		  <form onSubmit={this.searchFormSubmit}>
		    <div className="row border border-primary mt-1 rounded">
		      <div className="row m-1">
		        <div className="col">
		          <h4>Search Property Records</h4>
		        </div>
		      </div>
		    <div className="form-row d-flex align-items-end mt-1">
		      <div className="col-6 form-group">
 	            <label htmlFor="streetNameInput">Street Name</label>
		        <AutocompleteDataComponent inputName="streetNameInput"/>
		      </div>
		      <div className="col form-group">
		        <label htmlFor="minPriceInput">Min. Price</label>
		        <input 
		           type="text" 
		           className="form-control" 
		           id="minPriceInput" 
		           placeholder="Ex. 0" 
		           onChange={(e) => this.requireNumeric(e)}/>
	          </div>
		      <div className="col form-group">
		        <label htmlFor="maxPriceInput">Max. Price</label>
		        <input 
		           type="text" 
		           className="form-control" 
		           id="maxPriceInput" 
		           placeholder="Ex. 500000"
		           onChange={(e) => this.requireNumeric(e)}/>
		      </div>
		      <div className="col form-group">
		        <button type="submit" className="btn btn-primary">Search</button>
		      </div>
		    </div>
		    </div>
		  </form>
	    <div className="row mt-1">
          <div className="col-6">
	            {function(){
	            	if(this.state.propCount > 0) {
	            	  try {
	            	    let paginationKey = this.state.streetName + "-" + this.state.minPrice + "-" + this.state.maxPrice;
	            	    console.log(paginationKey);
	            	    return <Pagination
	                            key={paginationKey}
	                            pageLimit={10}
	                            totalRecords={this.state.propCount}
	                            pageRange={3}
	                            onPageChange={this.handlePageChange.bind(this)}/>
	            	  } catch (e) { }
	            	} else {
	            		if (this.state.errorType==="warning") {
	            		  return (
	            			<div className="alert alert-warning" role="alert">
	            	           {this.state.errorMessage}
	            	        </div>);
	            		} else if (this.state.errorType==="error") {
		            	  return (
		  	            	<div className="alert alert-error" role="alert">
		  	            	   {this.state.errorMessage}
		  	            	</div>);
	            		}
	            	}
	            }.bind(this)()}
	            <PropertyDetailList properties={this.state.properties} mapFunction={this.updateMap.bind(this)} currentProperty={this.state.currentProperty}/>
	      </div>
	      <div className="col-6">
	          {function(){
                if( this.state.currentProperty ) {
                  let imgKey = this.state.currentProperty;
                  return <MapnikImageContainer propertyId={this.state.currentProperty} key={imgKey}/>
                } else {
                  return null;	
                }
	          }.bind(this)()}
	      </div>
	    </div>
	  </div>
	);
  }
}
