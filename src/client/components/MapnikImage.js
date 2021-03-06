import React, { Component } from 'react';
import PropTypes from 'prop-types';

var placeholderImg = require('../../../public/images/GeneratingPlaceholder.png');

const hiddenStyle = { visibility: 'hidden' };

export default class MapnikImage extends Component {
  constructor(props) {
	super(props);
	this.state = { loadedImage: false }
  }
  
  onImageLoaded() {
	this.setState({loadedImage:true});
  }
  
  render() {
	let imageUrl = "/generateMap?propertyId=" + this.props.propertyId;
	if (this.props.radius) {
		imageUrl += "&radius=" + this.props.radius;
	}
	if (this.state.loadedImage) {
		return <img src={imageUrl} id="generatedimage" className="figure-img img-fluid border border-primary rounded"/>
	} else {
  	  return(<div>
	           <img src={placeholderImg} className="figure-img img-fluid border border-primary rounded" height="512" width="512"/>
               <div style={hiddenStyle}>
                 <img src={imageUrl} id="generatedimage" style={hiddenStyle} onLoad={this.onImageLoaded.bind(this)}/>
               </div>
             </div>);
    }
  }
}

MapnikImage.propTypes = {
  propertyId : PropTypes.number
}