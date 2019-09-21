DROP PROCEDURE IF EXISTS ParcelsInProximity;

DELIMITER $$
CREATE PROCEDURE ParcelsInProximity(IN propId INT, IN searchRadius DECIMAL(4,2))
BEGIN
	DECLARE areaCenter GEOMETRY;
    DECLARE areaBounding GEOMETRY;
    SELECT
        centerpoint
    INTO areaCenter
    FROM search_parcels
    WHERE ogr_fid = propId;
    SELECT
        st_buffer(areaCenter,searchRadius/69,ST_Buffer_Strategy('point_square'))
	INTO areaBounding
	FROM dual;
    -- For the provided propId, we return that record as the first in the data set,
	-- as well as returning its centerpoint to populate the bounding box calculation
    SELECT ogr_fid, address, price, st_asgeojson(shape) as shape, st_area(shape) as area, 
      CASE WHEN ogr_fid = propId THEN 1 ELSE 0 END as sortorder,
      CASE WHEN ogr_fid = propId THEN st_asgeojson(centerpoint) ELSE '' END as centerpoint
    FROM search_parcels 
	WHERE MBRContains(areaBounding,centerpoint)
    ORDER BY sortorder DESC;
END$$
DELIMITER ;

CALL ParcelsInProximity(704,0.5);
