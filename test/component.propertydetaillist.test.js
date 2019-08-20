import PropertyDetailList from '../src/client/components/PropertyDetailList'
import React from 'react'
import {shallow} from 'enzyme'

describe('PropertyDetailList', () => {
	test('test that property detail list renders', () => {
		let properties = [{address: "456 Test Ave", price:100000},{address: "123 Test St", price: 50000}];
		const wrapper = shallow(<PropertyDetailList properties={properties}/>)
	    expect(wrapper.find('.propertyDetail').length).toBe(2);
		expect(wrapper.find('.propertyDetailAddress').at(1).text()).toEqual("123 Test St");
	    expect(wrapper).toMatchSnapshot();
	    })
})