import React, { Component } from 'react';
import MapnikImage from './MapnikImage';

import LinkButton from './LinkButton'

var exampleImg = require('../../../public/images/ExampleImage.png');

export default class DefaultHome extends Component {
  constructor() {
	super();
  }
  
  render() {
    return (
      <div className="container" id="defaultHome">
      	<div className="row">
      	  <div className="col d-flex align-content-start flex-wrap">
      	    <p>This demo generates a visual comparison of the assessed value for properties surrounding the selected property.
      	    It can be used to identify potential oddities when purchasing a home, such as being assessed much lower than the
      	    surrounding properties, or being located near properties with far lower assessed values, which might not be immediately
      	    apparent on other types of searches.</p>
      	    <p>For demonstration purposes the database is limited to the city of Asheville, North Carolina and surroundings.</p>
      	    <p>The comparison map is generated using the GIS data from <a href="https://www.buncombecounty.org/Governing/Depts/GIS/download-digital-data.aspx#downloadable-data">Buncombe County</a>,
      	    North Carolina and rendered using the <a href="https://github.com/mapnik/node-mapnik">Mapnik</a> library.</p>
      	    <div className="row w-100">
      	      <div className="col-6">
      	        <LinkButton to="/examples" className="btn btn-secondary" id="defaultSearchResultsButton">Use Example Properties</LinkButton>
      	      </div>
       	      <div className="col-6">
    	        <LinkButton to="/search" className="btn btn-secondary" id="propertySearchButton">Search for Properties</LinkButton>
       	      </div>
       	    </div>
      	  </div>
      	  <div className="col">
      	    <img src={exampleImg} className="figure-img img-fluid border border-primary rounded mt-1"/>
      	  </div>
      	</div>
      </div>
    );
  }
}
