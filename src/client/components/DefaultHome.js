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
      	    <p>This demo generates a colorful visual comparison of the assessed value for properties surrounding the selected property.
      	    It can be used to identify potential oddities when purchasing a home, such as being assessed much lower than the
      	    surrounding properties, or being located near properties with far lower assessed values, which might not be immediately
      	    apparent on other types of searches.</p>
      	    <p>For demonstration purposes the database is limited to the city of Asheville, North Carolina and surroundings.</p>
      	    <p>The comparison map is generated using the GIS data from <a href="https://www.buncombecounty.org/Governing/Depts/GIS/download-digital-data.aspx#downloadable-data">Buncombe County</a>,
      	    North Carolina and rendered using the <a href="https://github.com/mapnik/node-mapnik">Mapnik</a> library.</p>
      	    <div className="container">
      	      <div className="row">
      	        <div className="col-5 align-content-center">
      	          <button id="defaultSearchResultsButton" className="btn btn-secondary" onClick={() => this.props.contentWellSelect('defaultSearchResults')}>Use Example Properties</button>
      	        </div>
      	        <div className="col-2 align-content-center">
      	          <h6>-OR-</h6>
      	        </div>
      	        <div className="col-5 align-content-center">
      	          <button id="propertySearchButton" className="btn btn-secondary" onClick={() => this.props.contentWellSelect('propertySearch')}>Search for Properties</button>
      	        </div>
      	      </div>
      	    </div>
      	  </div>
      	  <div className="col-4">
      	    <MapnikImage/>
      	  </div>
      	</div>
      </div>
    );
  }
}
