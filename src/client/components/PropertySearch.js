import React, { Component } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImage from './MapnikImage';
import AutocompleteDataComponent from './AutocompleteDataComponent';

export default class PropertySearch extends Component {
  constructor(props) {
	super(props);
	this.state = {properties: []};
  }
  
  requireNumeric(evt){
	evt.target.value = evt.target.value.replace(/[^0-9]/g,"");
  }
  
  render() {
	return(
      <div className="container w-100">
		<div className="row">
		  <form>
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
	      <div className="container w-100">
	        <div className="col-8">
	          <PropertyDetailList properties={this.state.properties}/>
	        </div>
	        <div className="col-4">
	          <MapnikImage/>
	        </div>
	      </div>
	    </div>
	  </div>
	);
  }
}
