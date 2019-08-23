import React, { Component } from 'react';
import DefaultHome from './DefaultHome';
import DefaultSearchResults from './DefaultSearchResults';
import PropertySearch from './PropertySearch';

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
	this.state = {contentPage : "default"};
  }
    
  contentWellSelect(contentPage) {
	  this.setState({contentPage : contentPage});
  }
  
  render() {
	switch (this.state.contentPage) {
	  case "defaultSearchResults":
		return(
			<DefaultSearchResults/>
		);
		break;
	  case "propertySearch":
		return(
			<PropertySearch/>
		);
		break;
	  default:
		return (
		  <DefaultHome contentWellSelect={contentPage => this.contentWellSelect(contentPage)}/>
		);
	}
  }
}
