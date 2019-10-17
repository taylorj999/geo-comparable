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