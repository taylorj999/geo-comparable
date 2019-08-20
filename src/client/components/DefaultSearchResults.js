import React, { Component } from 'react';
import PropertyDetailList from './PropertyDetailList';
import MapnikImage from './MapnikImage';

var properties = require('../config/defaultPropertyList');

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
	this.state = { properties : properties };
  }
    
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <PropertyDetailList properties={properties}/>
          </div>
          <div className="col-4">
            <MapnikImage/>
          </div>
        </div>
      </div>
    );
  }
}
