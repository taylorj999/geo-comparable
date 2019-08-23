import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

export default class Autocomplete extends React.Component {

    constructor ( props, context ) {
        super( props, context );

        var inputName = this.props.inputName;
        if (inputName===undefined) { inputName = "autocompleteInput"; }
        this.state = {
        	inputName: this.props.inputName,
            selected: false,
            hover: false,
            results: this.props.results,
            loading: this.props.loading
        };
        
        this.inputRef = createRef();
    }
    
    static getDerivedStateFromProps( nextProps, state) {
        return( {
            selected: false,
            hover: false,
            results: nextProps.results,
            loading: nextProps.loading
        } );
    }

    onChange( e ) {
        this.props.onSearch( e.target.value );
    }

    onBlur( e ) {
        setTimeout( function(){
            var state = { };
            state.selected = false;
            state.hover = false;
            state.results = [ ];

            this.setState( state );
        }.bind( this ), 250 );
    }

    select( index ) {
        var state = { };
        state.selected = index;
        state.hover = false;
        this.inputRef.current.value = this.state.results[ state.selected ];

        state.results = [ ];
        this.props.onSelect(this.state.results[index], index);
        
        this.setState( state );
    }

    render( ) {
        return (
            <div className="autocomplete dropdown show">
                <input 
                 ref={this.inputRef} 
                 onBlur={this.onBlur.bind(this)} 
                 onChange={this.onChange.bind( this )} 
                 placeholder="Search a city..." 
                 id={this.state.inputName}/> 

                {function(){
                    if( this.state.results.length ) {
                        return <ul className="dropdown-menu show" aria-labelledby={this.state.inputName}>{( !this.state.selected ) ? this.state.results.map(function( item, index ){
                            return <li className="dropdown-item" onClick={(e) => this.select(index)}>{item}</li>
                        }.bind( this )) : ''}</ul>
                    } else return "";
                }.bind(this)()}
            </div>
        );
    }
}