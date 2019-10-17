DROP TRIGGER IF EXISTS insert_parcel_trigger;

delimiter $$
CREATE TRIGGER insert_parcel_trigger AFTER INSERT ON parcels
FOR EACH ROW
BEGIN
  CALL UpsertOneSearchParcelsRow(NEW.ogr_fid);
END;$$
DELIMITER ;

DROP TRIGGER IF EXISTS update_parcel_trigger;

delimiter $$
CREATE TRIGGER update_parcel_trigger AFTER UPDATE ON parcels
FOR EACH ROW
BEGIN
  CALL UpsertOneSearchParcelsRow(NEW.ogr_fid);
END;$$
DELIMITER ;

DROP TRIGGER IF EXISTS delete_parcel_trigger;

delimiter $$
CREATE TRIGGER delete_parcel_trigger AFTER DELETE ON parcels
FOR EACH ROW
BEGIN
  DELETE FROM search_parcels WHERE ogr_fid = OLD.ogr_fid;
END;$$
DELIMITER ;

DROP TRIGGER IF EXISTS insert_street_trigger;

delimiter $$
CREATE TRIGGER insert_street_trigger AFTER INSERT ON streets
FOR EACH ROW
BEGIN
  INSERT INTO search_streets (ogr_fid, streetname, shape)
  VALUES (NEW.ogr_fid, CONCAT(NEW.street_nam, ' ', NEW.street_typ), st_geomfromtext(st_astext(NEW.shape)));
END;$$
DELIMITER ;

DROP TRIGGER IF EXISTS update_street_trigger;

delimiter $$
CREATE TRIGGER update_street_trigger AFTER UPDATE ON streets
FOR EACH ROW
BEGIN
  UPDATE search_streets SET streetname = CONCAT(NEW.street_nam, ' ', NEW.street_typ), 
                            shape = st_geomfromtext(st_astext(NEW.shape))
						WHERE ogr_fid = NEW.ogr_fid;
END;$$
DELIMITER ;

DROP TRIGGER IF EXISTS delete_street_trigger;

delimiter $$
CREATE TRIGGER delete_street_trigger AFTER DELETE ON streets
FOR EACH ROW
BEGIN
  DELETE FROM search_streets WHERE ogr_fid = OLD.ogr_fid;
END;$$
DELIMITER ;

