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
        <div className="propertyDetail container shadow-sm p-1 mb-1 bg-white rounded" key={row.ogr_fid}>
          <div className="row">
            <div className="col-8">
              <h5 className="propertyDetailAddress">{row.address}</h5>
            </div>
            <div className="col-4 d-flex">
            {function() {
            	if (this.props.mapFunction!=undefined) {
                  if (row.ogr_fid != this.props.currentProperty) {
            		return <button className="btn btn-primary ml-auto" onClick={(e) => this.handleClick(row.ogr_fid)}>Map It!</button>
                  } else {
                	return <button type="button" className="btn btn-secondary ml-auto" disabled>Map It!</button>
                  }
            	}
            }.bind(this)()}
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="propertyDetailPrice card-text">{this.prettyPrice(row.price)}</p>
            </div>
          </div>
        </div>
      ))}
      </div>
    );
  }
}

