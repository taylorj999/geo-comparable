import React, {Component} from 'react'
import {Route, HashRouter} from "react-router-dom";
	
import MainMenu from './components/MainMenu';
import DefaultHome from './components/DefaultHome';
import DefaultSearchResults from './components/DefaultSearchResults';
import PropertySearch from './components/PropertySearch';

export default class App extends Component {
  render() {
	return (
	  <HashRouter>
	    <div className="App">
	  	  <MainMenu/>
          <Route exact path="/" component={DefaultHome}/>
          <Route path="/examples" component={DefaultSearchResults}/>
          <Route path="/search" component={PropertySearch}/>
	    </div>
	  </HashRouter>
	);
  }
}