import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import ContentWell from './ContentWell';

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
  }
    
  render() {
    return (
      <div>
        <Navbar dark color="primary">
          <div className="container">
            <NavbarBrand href="/" className="mx-auto">
              {" "}
              Geo-Comparable Demo{" "}
            </NavbarBrand>
          </div>
        </Navbar>
        <ContentWell/>
      </div>
    );
  }
}
