import MapnikImageContainer from '../src/client/components/MapnikImageContainer'
import React from 'react'
import {mount} from 'enzyme'

describe('MapnikImageContainer', () => {
	const validRadius = [{name:"quarterMile",radius:0.25},{name:"halfMile",radius:0.5},{name:"mile",radius:1}];
	const propertyId = 704;
	const defaultRadius = validRadius[1].radius;
	const expectedImageUrl = "/generateMap?propertyId=" + propertyId;
	
	var wrapper = null;
	
	beforeAll(() => { wrapper = mount(<MapnikImageContainer propertyId={propertyId} validRadius={validRadius} radius={defaultRadius}/>); });
	
	test('test that mapnik image container renders', () => {
		let imageUrl = expectedImageUrl + "&radius=" + defaultRadius;
		expect(wrapper.find('img#generatedimage').prop("src")).toEqual(imageUrl);
	    expect(wrapper).toMatchSnapshot();
	});
	
	test('test radius buttons were rendered', () => {
		for (let x=0;x<validRadius.length;x++) {
			let buttonName = "#" + validRadius[x].name;
			expect(wrapper.find(buttonName)).toHaveLength(1);
		}
	});
	
	test('test that map changes when buttons are clicked', () => {
		for (let x=0;x<validRadius.length;x++) {
			let buttonName = "#" + validRadius[x].name;
			let button = wrapper.find(buttonName);
			expect(button.length).toBe(1);
			button.simulate('click');
			let imageUrl = expectedImageUrl + "&radius=" + validRadius[x].radius;
			expect(wrapper.find('img#generatedimage').prop("src")).toEqual(imageUrl);
		}
	});
	
})