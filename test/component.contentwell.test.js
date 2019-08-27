import ContentWell from '../src/client/components/ContentWell'
import React from 'react'
import {mount} from 'enzyme'

describe('ContentWell', () => {
	var wrapper = null;
	
	beforeAll(() => { wrapper = mount(<ContentWell/>); });
	
	beforeEach(() => { wrapper.setState({contentPage: "default"}); });
	
	test('test that default search result button works', () => {
		const button = wrapper.find("#defaultSearchResultsButton");
		expect(button.length).toBe(1);
		
		button.simulate('click');
		
		expect(wrapper.state('contentPage')).toEqual("defaultSearchResults");
		
	    expect(wrapper).toMatchSnapshot();
	    });
	
	test('test that property search button works', () => {
		const button = wrapper.find("#propertySearchButton");
		expect(button.length).toBe(1);
		
		button.simulate('click');
		
		expect(wrapper.state('contentPage')).toEqual("propertySearch");
		
	    expect(wrapper).toMatchSnapshot();
	});
})