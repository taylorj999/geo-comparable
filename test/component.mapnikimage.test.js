import MapnikImage from '../src/client/components/MapnikImage'
import React from 'react'
import {shallow} from 'enzyme'

describe('MapnikImage', () => {
	test('test that mapnik image renders', () => {
		let propertyId = 500;
		let expectedImageUrl = "/testRender?propertyId=500";
		const wrapper = shallow(<MapnikImage propertyId={propertyId}/>)
		expect(wrapper.find('img').prop("src")).toEqual(expectedImageUrl);
	    expect(wrapper).toMatchSnapshot();
	    })
})