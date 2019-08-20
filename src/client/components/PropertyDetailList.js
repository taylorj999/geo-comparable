import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PropertyDetailList extends Component {
  constructor(props) {
	super(props);
	this.state = { properties: this.props.properties };
  }
  
  render() {
    return (
      <div className="list-group">
      {this.state.properties.map((row,index) => (
      <div className="propertyDetail list-group-item" key="{index}">
        <div className="propertyDetailAddress w-100">{row.address}</div>
        <div className="propertyDetailPrice w-100">{row.price}</div>
      </div>
      ))}
      </div>
    );
  }
}

PropertyDetailList.propTypes = {
  properties : PropTypes.arrayOf(PropTypes.shape({address: PropTypes.string, price: PropTypes.number}))
}