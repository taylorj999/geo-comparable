import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PropertyDetailList extends Component {
  constructor(props) {
	super(props);
  }
  
  handleClick(propertyId) {
	this.props.mapFunction(propertyId);
  }
  
  prettyPrice(price) {
	let strPrice = "" + price;
    let j = (j = strPrice.length) > 3 ? j % 3 : 0;
    return "$" + (j ? strPrice.substr(0, j) + "," : "") + strPrice.substr(j).replace(/(\d{3})(?=\d)/g, "$1,");
  }
  
  render() {
    return (
      <div>
      {this.props.properties.map((row,index) => (
      <div className="propertyDetail card" key={row.ogr_fid}>
        <div className="card-body">
          <h5 className="propertyDetailAddress card-title">{row.address}</h5>
          <p className="propertyDetailPrice card-text">{this.prettyPrice(row.price)}</p>
          {function() {
        	if (this.props.mapFunction!=undefined) {
              if (row.ogr_fid != this.props.currentProperty) {
        		return <a href="#" className="btn btn-primary" onClick={(e) => this.handleClick(row.ogr_fid)}>Map It!</a>
              } else {
            	return <button type="button" className="btn btn-secondary" disabled>Map It!</button>
              }
        	}
          }.bind(this)()}
        </div>
      </div>
      ))}
      </div>
    );
  }
}

