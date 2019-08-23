import AutocompleteDataComponent from '../src/client/components/AutocompleteDataComponent'
import React from 'react'
import {mount} from 'enzyme'

describe('Autocomplete Data Component', () => {
	test('test that autocomplete list component loads', () => {
		const wrapper = mount(<AutocompleteDataComponent/>);
		
	    expect(wrapper).toMatchSnapshot();
	    })
})