import React, { Component } from 'react';
import InlineSVG from 'svg-inline-react';

const svgSource = `<svg width="512" height="128" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
	 <g transform="scale(1,0.7) translate(0,19)">
	  <polygon stroke-width="0" points="0,84 0,42 47,42 47,75.8 0,84 " fill="#990000" id="svg_00"/>
	  <polygon stroke-width="0" points="47,75.8 47,42 94,42 94,67 47,75.8 " fill="#B31A1A" id="svg_01"/>
	  <polygon stroke-width="0" points="94,42 94,67 141,59 141,42 94,42 " fill="#CC3333" id="svg_02"/>
	  <polygon stroke-width="0" points="141,59 141,42 188,42 188,51 141,59 " fill="#E64D4D" id="svg_03"/>
	  <polygon stroke-width="0" points="188,42 188,51 238,42 188,42" fill="#FF6666" id="svg_04"/>
	  <polygon stroke="#000000" points="0,84 0,42 238,42 0,84 " fill="none" id="svg_1"/>
	  <polygon stroke-width="0" points="512,0 512,42 465,42 465,8 512,0" fill="#009900" id="svg_20"/>
	  <polygon stroke-width="0" points="465,8 465,42 418,42 418,16 465,8" fill="#1AB31A" id="svg_21"/>
	  <polygon stroke-width="0" points="418,42 418,16 371,24 371,42 418,42" fill="#33CC33" id="svg_22"/>
	  <polygon stroke-width="0" points="371,24 371,42 324,42 324,32 371,24" fill="#4DE64D" id="svg_23"/>
	  <polygon stroke-width="0" points="324,42 324,32 272,42 324,42" fill="#66FF66" id="svg_24"/>
	  <polygon stroke="#000000" points="272,42 512,42 512,0 272,42 " fill="none" id="svg_2"/>
	</g>
	<g>
	   <text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="16" id="svg_3" y="62" x="23" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#FFFFFF" fill="#FFFFFF">&lt;50%</text>
	   <text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="16" id="svg_3" y="35" x="489" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#FFFFFF" fill="#FFFFFF">150%</text>
	</g>
	<g transform="translate(240,13) scale(0.048,0.048)">
	  <path d="M121.18,388.775v170.619v57.598v6.928h451v-6.248v-58.277V389.455L346.347,202.668L121.18,388.775z M445.18,544.086
			H247.513v-187H445.18V544.086z M435.695,445.965h-83.543v-78.109h83.543V445.965z M341.284,445.965H257.74v-78.109h83.542
			L341.284,445.965L341.284,445.965z M435.695,534.264h-83.543v-78.109h83.543V534.264z M341.284,534.264H257.74v-78.109h83.542
			L341.284,534.264L341.284,534.264z M693.359,354.584l-38.52,46.799L346.347,147.944L38.52,401.383L0,354.584L346.347,69.439
			L693.359,354.584z" fill="#0080FF"/>
	</g>
  </svg>`;

class MapColorKey extends Component {
	render() {
		return(<InlineSVG src={svgSource}/>);
	}
}

export default MapColorKey;