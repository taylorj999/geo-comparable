import MapColorKey from '../src/client/components/MapColorKey'
import React from 'react'
import {mount} from 'enzyme'

describe('DefaultSearchResults Component', () => {
	
	beforeAll(() => {  });
	
	test('test that default search results component loads', () => {
		const wrapper = mount(<MapColorKey/>);
				
	    expect(wrapper).toMatchSnapshot();
	    })
})