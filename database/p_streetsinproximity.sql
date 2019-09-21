DROP PROCEDURE IF EXISTS StreetsInProximity;

DELIMITER $$
CREATE PROCEDURE StreetsInProximity(IN propId INT, IN searchRadius DECIMAL(4,2))
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
    SELECT streetname, st_asgeojson(shape) as shape FROM search_streets 
	WHERE MBRIntersects(areaBounding,shape);
END$$
DELIMITER ;

CALL StreetsInProximity(704,0.5);
