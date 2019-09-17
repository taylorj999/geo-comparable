import Pagination from '../src/client/components/Pagination'
import React from 'react'
import {shallow} from 'enzyme'

describe('PropertySearch  Component', () => {
	test('test that property search component loads', () => {
		let totalRecords = 300;
		let pageLimit = 10;
		let pageRange = 3;
		const wrapper = shallow(<Pagination totalRecords={totalRecords} pageLimit={pageLimit} pageRange={pageRange}/>);
		
	    expect(wrapper).toMatchSnapshot();
	    })
})