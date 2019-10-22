var template = {};

template.mapStart = '<Map srs="+init=epsg:3857">';
template.mapEnd = '</Map>';

template.styleBlock = `<Style name="Polygon">
<Rule>
  <LineSymbolizer stroke="black" stroke-width="2" />
  <PolygonSymbolizer fill="[fill]" />
  <TextSymbolizer face-name="DejaVu Sans Book" placement-type="simple" placement="point" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>
</Rule>
</Style>
<Style name="LineString">
  <Rule>
    <LineSymbolizer stroke="[stroke]" stroke-width="[width]" stroke-opacity="[opacity]" />
    <TextSymbolizer face-name="DejaVu Sans Book" placement-type="simple" placement="line" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>
  </Rule>
</Style>
<Style name="MultiPolygon">
<Rule>
  <LineSymbolizer stroke="black" stroke-width="2" />
  <PolygonSymbolizer fill="[fill]" />
  <TextSymbolizer face-name="DejaVu Sans Book" placement-type="simple" placement="point" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>
</Rule>
</Style>
<Style name="Point">
<Rule>
  <TextSymbolizer face-name="DejaVu Sans Book" placement-type="simple" placement="point" allow-overlap="true" halo-radius="2">[name]</TextSymbolizer>
</Rule>
</Style>`;

template.parcelLayerBlock =`    <Layer name="layer" srs="+init=epsg:4326">
	        <StyleName>Polygon</StyleName>
	        <StyleName>MultiPolygon</StyleName>
	        <Datasource>
	            <Parameter name="type">geojson</Parameter>
	            <Parameter name="inline"><![CDATA[{{parcelgeojson}}]]></Parameter>
	        </Datasource>
	    </Layer>`;

template.streetLayerBlock =`    <Layer name="layer" srs="+init=epsg:4326">
        <StyleName>LineString</StyleName>
        <Datasource>
            <Parameter name="type">geojson</Parameter>
            <Parameter name="inline"><![CDATA[{{streetgeojson}}]]></Parameter>
        </Datasource>
    </Layer>`;

template.labelsLayerBlock =`    <Layer name="layer" srs="+init=epsg:4326">
        <StyleName>Point</StyleName>
        <Datasource>
            <Parameter name="type">geojson</Parameter>
            <Parameter name="inline"><![CDATA[{{labelgeojson}}]]></Parameter>
        </Datasource>
    </Layer>`;

module.exports = template;