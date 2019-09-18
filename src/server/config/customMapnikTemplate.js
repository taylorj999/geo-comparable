var oldtemplate = '<Map srs="+init=epsg:3857">' +
'    <Style name="geoms">' +
'        <Rule>' +
'            <Filter>[mapnik::geometry_type]=polygon or [fill]</Filter>' +
'            <PolygonSymbolizer fill="[fill]" fill-opacity="[fill-opacity]" />'+
'        </Rule>'+
'        <Rule>'+
'            <Filter>[mapnik::geometry_type]=linestring or [stroke]</Filter>'+
'            <LineSymbolizer stroke="[stroke]" stroke-width="[stroke-width]" stroke-opacity="[stroke-opacity]" />'+
'        </Rule>'+
'    </Style>'+
'    <Style name="points" filter-mode="first">'+
'        <Rule>'+
'            <Filter>[mapnik::geometry_type]=point and [marker-path]</Filter>'+
'            <PointSymbolizer'+
'              file="[marker-path]"'+
'              allow-overlap="true"'+
'              ignore-placement="true"'+
'            />'+
'        </Rule>'+
'    </Style>'+
'    <Layer name="layer" srs="+init=epsg:4326">'+
'        <StyleName>geoms</StyleName>'+
'        <StyleName>points</StyleName>'+
'        <Datasource>'+
'            <Parameter name="type">geojson</Parameter>'+
'            <Parameter name="inline"><![CDATA[{{geojson}}]]></Parameter>'+
'        </Datasource>'+
'    </Layer>'+
'</Map>';

var template = {};

template.mapStart = '<Map srs="+init=epsg:3857">';
template.mapEnd = '</Map>';

template.styleBlock = '<Style name="Polygon">'+
'<Rule>'+
'  <LineSymbolizer stroke="black" stroke-width="2" />'+
'  <PolygonSymbolizer fill="[fill]" />'+
'  <TextSymbolizer face-name="Arial Regular" placement-type="simple" placement="X" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>'+
'</Rule>'+
'</Style>' +
'<Style name="LineString">' +
'  <Rule>'+
'    <LineSymbolizer stroke="[stroke]" stroke-width="[width]" stroke-opacity="[opacity]" />'+
'    <TextSymbolizer face-name="Arial Regular" placement-type="simple" placement="line" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>'+
'  </Rule>'+
'</Style>'+
'<Style name="MultiPolygon">'+
'<Rule>'+
'  <LineSymbolizer stroke="black" stroke-width="2" />'+
'  <PolygonSymbolizer fill="[fill]" />'+
'  <TextSymbolizer face-name="Arial Regular" placement-type="simple" placement="X" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>'+
'</Rule>'+
'</Style>';

template.parcelLayerBlock ='    <Layer name="layer" srs="+init=epsg:4326">'+
	'        <StyleName>Polygon</StyleName>'+
	'        <StyleName>MultiPolygon</StyleName>'+
	'        <Datasource>'+
	'            <Parameter name="type">geojson</Parameter>'+
	'            <Parameter name="inline"><![CDATA[{{parcelgeojson}}]]></Parameter>'+
	'        </Datasource>'+
	'    </Layer>';

template.streetLayerBlock ='    <Layer name="layer" srs="+init=epsg:4326">'+
'        <StyleName>LineString</StyleName>'+
'        <Datasource>'+
'            <Parameter name="type">geojson</Parameter>'+
'            <Parameter name="inline"><![CDATA[{{streetgeojson}}]]></Parameter>'+
'        </Datasource>'+
'    </Layer>';

module.exports = template;