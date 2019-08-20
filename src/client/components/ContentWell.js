import React, { Component } from 'react';
import DefaultHome from './DefaultHome';
import DefaultSearchResults from './DefaultSearchResults';

export default class MainMenu extends Component {
  constructor(props) {
	super(props);
	this.state = {contentPage : "default"};
  }
    
  contentWellSelect(contentPage) {
	  this.setState({contentPage : contentPage});
  }
  
  render() {
	if (this.state.contentPage === "defaultSearchResults") {
		return(
			<DefaultSearchResults/>
		);
	} else {
		return (
			<div>
			  <div>{this.state.contentPage}</div>
			  <DefaultHome contentWellSelect={contentPage => this.contentWellSelect(contentPage)}/>
			</div>
		);
	}
  }
}
