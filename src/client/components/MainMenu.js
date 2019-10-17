import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
  }
    
  render() {
    return (
        <div className="nav navbar navbar-expand-lg navbar-dark bg-primary" role="navigation">
          <NavLink to="/" className="navbar-brand" id="headerHomeLink">Geo-Comparable Demo</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink to="/examples" className="nav-item nav-link" id="headerExampleLink" activeClassName="active">Examples</NavLink>
              <NavLink to="/search" className="nav-item nav-link" id="headerSearchLink" activeClassName="active">Search</NavLink>
              <a className="nav-item nav-link" href="http://www.github.com/taylorj999/geo-comparable" target="_new">Source</a>
            </div>
          </div>
        </div>
    );
  }
}
