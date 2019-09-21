DROP PROCEDURE IF EXISTS build_search_parcels_mv;

DELIMITER $$
CREATE PROCEDURE build_search_parcels_mv()
BEGIN
  INSERT INTO search_parcels(ogr_fid, price, address, centerpoint, shape, streetname, housenumber, searchable)
  SELECT p.ogr_fid, 
         CASE WHEN p.totalmarke > 0 THEN p.totalmarke ELSE ROUND(p.saleprice) END as price,
         create_full_address(p.ogr_fid) as address, 
         st_centroid(st_geomfromtext(st_astext(p.shape))) as centerpoint,
         st_geomfromtext(st_astext(p.shape)) as shape, 
         CONCAT(p.streetname, ' ', p.streettype) as streetname,
         cast(p.housenumbe as unsigned) as housenumber,
         CASE WHEN p.housenumbe LIKE '9999%' THEN 0 ELSE 1 END as searchable
    FROM parcels p
   WHERE p.streetname is not null AND p.streettype is not null
  ON DUPLICATE KEY UPDATE 
		price = CASE WHEN p.totalmarke > 0 THEN p.totalmarke ELSE ROUND(p.saleprice) END,
        address = create_full_address(p.ogr_fid),
        centerpoint = st_centroid(st_geomfromtext(st_astext(p.shape))),
        shape = st_geomfromtext(st_astext(p.shape)),
        streetname = CONCAT(p.streetname, ' ', p.streettype),
        housenumber = cast(p.housenumbe as unsigned),
        searchable = CASE WHEN p.housenumbe LIKE '9999%' THEN 0 ELSE 1 END;
END$$
DELIMITER ;

CALL build_search_parcels_mv();