import MapnikImage from '../src/client/components/MapnikImage'
import React from 'react'
import {shallow} from 'enzyme'

describe('MapnikImage', () => {
	test('test that mapnik image generates the correct url', () => {
		let propertyId = 500;
		let defaultRadius = 0.5;
		let expectedImageUrl = "/generateMap?propertyId=" + propertyId + "&radius=" + defaultRadius;
		const wrapper = shallow(<MapnikImage propertyId={propertyId} radius={defaultRadius}/>)
		expect(wrapper.find('img#generatedimage').prop("src")).toEqual(expectedImageUrl);
	    expect(wrapper).toMatchSnapshot();
	    })
})