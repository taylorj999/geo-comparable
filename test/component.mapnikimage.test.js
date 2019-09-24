import MapnikImage from '../src/client/components/MapnikImage'
import React from 'react'
import {shallow} from 'enzyme'

describe('MapnikImage', () => {
	test('test that mapnik image renders', () => {
		let propertyId = 500;
		let expectedImageUrl = "/generateMap?propertyId=500";
		const wrapper = shallow(<MapnikImage propertyId={propertyId}/>)
		expect(wrapper.find('img#generatedimage').prop("src")).toEqual(expectedImageUrl);
	    expect(wrapper).toMatchSnapshot();
	    })
})