DROP PROCEDURE IF EXISTS BuildSearchStreets;

DELIMITER $$
CREATE PROCEDURE BuildSearchStreets()
BEGIN
  INSERT INTO search_streets (ogr_fid, streetname, shape)
  SELECT ogr_fid, full_stree, st_geomfromtext(st_astext(st.shape))
    FROM streets st
  ON DUPLICATE KEY UPDATE shape = st_geomfromtext(st_astext(st.shape));
END$$
DELIMITER ;

CALL BuildSearchStreets();