import ContentWell from '../src/client/components/ContentWell'
import React from 'react'
import {mount} from 'enzyme'

describe('ContentWell', () => {
	test('test that content well state buttons work', () => {
		const wrapper = mount(<ContentWell/>);
		
		const button = wrapper.find("#defaultSearchResultsButton");
		expect(button.length).toBe(1);
		
		button.simulate('click');
		
		expect(wrapper.state('contentPage')).toEqual("defaultSearchResults");
		
	    expect(wrapper).toMatchSnapshot();
	    })
})