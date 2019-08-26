import React, { Component } from 'react';
import Autocomplete from './Autocomplete';

import axios from 'axios';

var config = require('../config/config');

const API_KEY = config.client.api_key;

export default class AutocompleteContainer extends React.Component {
    constructor ( props, context ) {
        super( props, context );
        this.state = {
        	inputName: this.props.inputName,
            results: [ ],
            loading: false,
            selected: '',
            emptySearchResults: false
        };
    }

    onSearch( value ) {
        this.state.results = [ ];

        value = value.trim( );
        if( value == "" ) {
            this.state.loading = false;
            this.state.emptySearchResults = false;
            this.setState( this.state );
            return;
        }

        this.state.loading = true;
        this.setState( this.state );
        
        axios.post("/api-autocomplete", { apiKey: API_KEY, searchString : value })
        .then(res => {
          if (res.data.status === "success") {
            let newStreets = [];
            for (let x=0;x<res.data.data.length;x++) {
        	  newStreets.push(res.data.data[x].streetnames);
            }
            if (res.data.data.length > 0) { this.state.emptySearchResults = false; } else { this.state.emptySearchResults = true; }
            this.state.results = newStreets;
            this.setState(this.state);
          } else {
        	console.log("Error in API component, see server logs for details");
          }
        })
        .catch(function (error) {
        	console.log(error);
        })
    }

    onSelect( result, index ) {
        console.log( "selected", result, index );
        this.state.selected = result;
        this.state.results = [ ];
        this.setState( this.state );
    }

    render( ) {
        return (
            <Autocomplete
            	inputName={this.state.inputName}
                onSearch={this.onSearch.bind( this )}
                onSelect={this.onSelect.bind( this )}
                results={this.state.results}
                loading={this.state.loading}
                emptySearchResults={this.state.emptySearchResults}/>
        );
    }
}