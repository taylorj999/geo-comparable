import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

export default class Autocomplete extends React.Component {

    constructor ( props, context ) {
        super( props, context );

        let inputName = this.props.inputName;
        if (inputName===undefined) { inputName = "autocompleteInput"; }
        this.state = {
        	inputName: this.props.inputName,
            selected: false,
            results: this.props.results,
            emptySearchResults: this.props.emptySearchResults
        };
        
        this.inputRef = createRef();
    }
    
    static getDerivedStateFromProps( nextProps, state) {
        return( {
            selected: false,
            results: nextProps.results,
            emptySearchResults: nextProps.emptySearchResults
        } );
    }

    onChange( e ) {
        this.props.onSearch( e.target.value );
    }

    onBlur( e ) {
        setTimeout( function(){
            this.props.onBlur();
        }.bind( this ), 250 );
    }

    select( index ) {
        this.inputRef.current.value = this.state.results[ index ];

        this.props.onSelect(this.state.results[index], index);
        
        this.setState( { results: [], selected: index } );
    }

    render( ) {
    	return (
            <div className="autocomplete dropdown show">
                <input 
                 ref={this.inputRef} 
                 onBlur={this.onBlur.bind(this)} 
                 onChange={this.onChange.bind( this )} 
                 placeholder="Ex. STAFFORD ST" 
                 id={this.state.inputName}
                 autoComplete="off"
                 className="form-control"/> 

                {function(){
                    if( this.state.results.length ) {
                        return <ul className="dropdown-menu show" aria-labelledby={this.state.inputName}>{( !this.state.selected ) ? this.state.results.map(function( item, index ){
                            return <li className="dropdown-item" onClick={(e) => this.select(index)}>{item}</li>
                        }.bind( this )) : ''}</ul>
                    } else if ( this.state.emptySearchResults ){
                    	return <ul className="dropdown-menu show"><li className="dropdown-item text-danger"><i>No streets found.</i></li></ul>
                    }
                }.bind(this)()}
            </div>
        );
    }
}