import React, { Component } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImage from './MapnikImage';

var defaultPropertyList = require('../config/defaultPropertyList');

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
	this.state = { properties : defaultPropertyList };
  }
    
  render() {
    return (
      <div className="container" id="defaultSearchResults">
        <div className="row">
          <div className="col">
            <PropertyDetailList properties={this.state.properties}/>
          </div>
          <div className="col-4">
            <MapnikImage propertyId={this.state.properties[0].ogr_fid} key={this.state.properties[0].ogr_fid}/>
          </div>
        </div>
      </div>
    );
  }
}
