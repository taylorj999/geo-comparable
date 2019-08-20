import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MapnikImage extends Component {
  constructor(props) {
	super(props);
	this.state = { propertyId : this.props.propertyId };
  }
  
  render() {
	let imageUrl = "/testRender?propertyId=" + this.state.propertyId;
    return (
      <figure className="figure">
        <img src={imageUrl} class="figure-img img-fluid rounded" alt="Loading..."/>
      </figure>
    );
  }
}

MapnikImage.propTypes = {
  propertyId : PropTypes.number
}