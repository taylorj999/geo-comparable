import PropertySearch from '../src/client/components/PropertySearch'
import React from 'react'
import {mount} from 'enzyme'

describe('PropertySearch  Component', () => {
	test('test that property search component loads', () => {
		const wrapper = mount(<PropertySearch/>);
		
	    expect(wrapper).toMatchSnapshot();
	    })
})