import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PropertyDetailList extends Component {
  constructor(props) {
	super(props);
	this.state = { properties: this.props.properties };
  }
  
  render() {
    return (
      <div>
      {this.state.properties.map((row,index) => (
      <div className="propertyDetail card w-100" key={index}>
        <div className="card-body">
          <h5 className="propertyDetailAddress card-title">{row.address}</h5>
          <p className="propertyDetailPrice card-text">{row.price}</p>
        </div>
      </div>
      ))}
      </div>
    );
  }
}

PropertyDetailList.propTypes = {
  properties : PropTypes.arrayOf(PropTypes.shape({address: PropTypes.string, price: PropTypes.number}))
}