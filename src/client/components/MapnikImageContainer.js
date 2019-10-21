import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MapnikImage from './MapnikImage';
import MapColorKey from './MapColorKey';

export default class MapnikImageContainer extends Component {
  constructor(props) {
	super(props);
	const validRadius = [{name:"quarterMile",radius:0.25},{name:"halfMile",radius:0.5},{name:"mile",radius:1}];
	this.state = {};
	if (this.props.radius) { this.state.radius = this.props.radius; } else { this.state.radius = 0.5; }
	if (this.props.validRadius) { this.state.validRadius = this.props.validRadius; } else { this.state.validRadius = validRadius; }
  }

  changeRadius(newRadius) {
	this.setState({radius: newRadius});
  }
  
  render() {
	let imageComponentKey = "img" + this.props.propertyId + " " + this.state.radius;
	return(
	  <div className="container">
	    <div className="row">
	      <div className="col d-flex justify-content-center">
	        <div className="btn-group mb-3" role="group" aria-label="Radius selection">
	          {this.state.validRadius.map((row,index) => {
	        	  let butnKey = row.name + "-" + row.radius;
	        	  if (this.state.radius != row.radius) {
	        	    return (<button type="button" id={row.name} key={butnKey} 
	        	            className="btn btn-primary" onClick={(e) => this.changeRadius(row.radius)}
	        	            data-toggle="tooltip" title="Select search radius">{row.radius}&nbsp;mi</button>);
	        	  } else {
	        		return (<button type="button" id={row.name} key={butnKey} 
	        		         className="btn btn-secondary">{row.radius}&nbsp;mi</button>);
	        	  }
	            }
	          )}
	        </div>
	      </div>
	    </div>
	    <div className="row">
	      <div className="col-12">
	        <MapnikImage propertyId={this.props.propertyId} radius={this.state.radius} key={imageComponentKey}/>
	        <MapColorKey/>
	      </div>
	    </div>
	  </div>);
  }
}

MapnikImage.propTypes = {
  propertyId : PropTypes.number
}