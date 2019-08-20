import React, { Component } from 'react';
import MapnikImage from './MapnikImage';

export default class DefaultHome extends Component {
  constructor() {
	super();
  }
  
  render() {
    return (
      <div className="container">
      	<div className="row">
      	  <div className="col d-flex align-content-start flex-wrap">
      	    <p>This is the default homepage text.</p>
      	  </div>
      	  <div className="col-4">
      	    <MapnikImage/>
      	  </div>
      	</div>
      </div>
    );
  }
}
