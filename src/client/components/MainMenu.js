import React, { Component } from 'react';
import ContentWell from './ContentWell';

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
  }
    
  render() {
    return (
      <div>
        <div className="nav navbar navbar-expand-lg navbar-dark bg-primary" role="navigation">
          <a className="navbar-brand" href="/">Geo-Comparable Demo</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-item nav-link active" href="http://www.github.com/taylorj999/geo-comparable" target="_new">Source</a>
            </div>
          </div>
        </div>
        <ContentWell/>
      </div>
    );
  }
}
