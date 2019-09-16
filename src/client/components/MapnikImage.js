import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MapnikImage extends Component {
  constructor(props) {
	super(props);
  }
  
  render() {
	let imageUrl = "/testRender?propertyId=" + this.props.propertyId;
    return (
      <figure className="figure">
        <img src={imageUrl} className="figure-img img-fluid rounded" alt="Loading..."/>
      </figure>
    );
  }
}

MapnikImage.propTypes = {
  propertyId : PropTypes.number
}