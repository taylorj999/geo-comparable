import PropertyDetailList from '../src/client/components/PropertyDetailList'
import React from 'react'
import {shallow} from 'enzyme'

describe('PropertyDetailList', () => {
	var wrapper = null;
	const testProperties=[{ogr_fid:"1", address: "456 Test Ave", price:100000},{ogr_fid:"2", address: "123 Test St", price: 50000}];
	
	test('test that property detail list renders without errors', () => {
		wrapper = shallow(<PropertyDetailList properties={testProperties}/>);
		expect(wrapper).toMatchSnapshot();
	});
	
	test('test that property detail list contains all test data', () => {
		expect(wrapper.find('.propertyDetail').length).toBe(testProperties.length);
		for (let x=0;x<testProperties.length;x++) {
			expect(wrapper.find('.propertyDetailAddress').at(x).text()).toEqual(testProperties[x].address);
		}
	});
})