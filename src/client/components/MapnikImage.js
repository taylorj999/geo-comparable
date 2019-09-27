import React, { Component } from 'react';
import PropTypes from 'prop-types';

var placeholderImg = require('../../../public/images/GeneratingPlaceholder.png');

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
		return <img src={imageUrl} id="generatedimage" className="figure-img img-fluid rounded"/>
	} else {
  	  return(<div>
	           <img src={placeholderImg} className="figure-img img-fluid rounded"/>
               <div className="hidden">
                 <img src={imageUrl} id="generatedimage" className="hidden" onLoad={this.onImageLoaded.bind(this)}/>
               </div>
             </div>);
    }
  }
}

MapnikImage.propTypes = {
  propertyId : PropTypes.number
}