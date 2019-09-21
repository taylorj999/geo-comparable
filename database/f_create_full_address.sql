DROP FUNCTION IF EXISTS create_full_address;

DELIMITER $$
CREATE FUNCTION create_full_address(propId INT) RETURNS varchar(50) CHARSET utf8mb4
    READS SQL DATA
BEGIN
  DECLARE address VARCHAR(50);
  SELECT CONCAT(COALESCE(housenumbe,''),CASE when housenumbe is null then '' else ' ' end,
                COALESCE(numbersuff,''),CASE when numbersuff is null then '' else ' ' end,
				COALESCE(direction,''),CASE when direction is null then '' else ' ' end,
                COALESCE(streetname,''),CASE when streetname is null then '' else ' ' end,
                COALESCE(streettype,''))
	INTO address
    FROM parcels
   WHERE ogr_fid = propId;
  RETURN address;
END$$
DELIMITER ;

SELECT create_full_address(704) from DUAL;