import React, { Component } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImageContainer from './MapnikImageContainer';

var defaultPropertyList = require('../config/defaultPropertyList');

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
	this.state = { properties : defaultPropertyList, currentProperty : defaultPropertyList[0].ogr_fid };
  }
  
  updateMap(propertyId) {
	  this.setState({currentProperty:propertyId});
  }

  render() {
    return (
      <div className="container" id="defaultSearchResults">
	    <div className="row mt-1">
          <div className="col-6">
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
