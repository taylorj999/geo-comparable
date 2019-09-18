import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = function (from, to, step = 1) {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

class Pagination extends Component {
  constructor(props) {
    super(props);
    let pageLimit = Math.max(10,this.props.pageLimit);
    let pageRange = Math.min(3,this.props.pageRange);
    let maxPages = Math.ceil(this.props.totalRecords / this.props.pageLimit);
    
    this.state = {totalRecords: this.props.totalRecords, maxPages: maxPages, pageLimit: pageLimit, pageRange: pageRange,
    			   currentPage: 1};
  }

  handleClick(pageNumber) {
	  this.setState({currentPage:pageNumber});
	  if (this.props.onPageChange != null) {
		  this.props.onPageChange(pageNumber);
	  }
  }
  
  render() {
    if (!this.state.totalRecords || this.state.maxPages === 1) return null;
    const pages = range(Math.max(1,this.state.currentPage-1),Math.min(this.state.maxPages,this.state.currentPage+this.state.pageRange-1));
    return(
    <div>
    <ul className="pagination">
      {function() {
    	if (pages[0] != 1) {
    	  let pageKey = "page" + 1;
    	  return <li className="page-item" key={pageKey}><a className="page-link" href="#" onClick={(e) => this.handleClick(1)}>&lt;&lt;</a></li>
    	}
      }.bind(this)()}
      {pages.map(function(item,index) {
    	  let pageKey = "page" + item;
    	  if (item===this.state.currentPage) {
    		  return <li className="page-item active" key={pageKey}><span class="page-link">{item}</span></li>
    	  } else {
    		  return <li className="page-item" key={pageKey}><a className="page-link" href="#" onClick={(e) => this.handleClick(item)}>{item}</a></li>
    	  }
      }.bind(this))}
      {function() {
      	if (pages[pages.length - 1] != this.state.maxPages) {
      	  let pageKey = "page" + this.state.maxPages;
      	  return <li className="page-item" key={pageKey}><a className="page-link" href="#" onClick={(e) => this.handleClick(this.state.maxPages)}>&gt;&gt;</a></li>
      	}
      }.bind(this)()}
    </ul>
    </div>);
  }
}

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageRange: PropTypes.number,
  onPageChange: PropTypes.func
};

export default Pagination;