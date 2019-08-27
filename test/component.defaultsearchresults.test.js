import DefaultSearchResults from '../src/client/components/DefaultSearchResults'
import React from 'react'
import {mount} from 'enzyme'

var properties = require('../src/client/config/defaultPropertyList');

describe('DefaultSearchResults Component', () => {
	
	beforeAll(() => {  });
	
	test('test that default search results component loads', () => {
		const wrapper = mount(<DefaultSearchResults/>);
		
		var propCount = properties.length;
		
	    expect(wrapper.find('.propertyDetail').length).toBe(propCount);
		
	    expect(wrapper).toMatchSnapshot();
	    })
})