CREATE TABLE `autocomplete_streetnames` (
  `streetnames` varchar(35) NOT NULL,
  PRIMARY KEY (`streetnames`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `search_parcels` (
  `OGR_FID` int(11) NOT NULL,
  `ADDRESS` varchar(50) NOT NULL,
  `centerpoint` geometry NOT NULL /*!80003 SRID 0 */,
  `shape` geometry NOT NULL /*!80003 SRID 0 */,
  `STREETNAME` varchar(45) NOT NULL,
  `PRICE` decimal(10,0) DEFAULT NULL,
  `SEARCHABLE` int(1) NOT NULL DEFAULT '1',
  `HOUSENUMBER` int(11) DEFAULT NULL,
  PRIMARY KEY (`OGR_FID`),
  KEY `idx_search_parcels_STREETNAME` (`STREETNAME`),
  KEY `idx_search_parcels_PRICE` (`PRICE`),
  SPATIAL KEY `idx_search_parcels_CENTERPOINT` (`centerpoint`),
  FULLTEXT KEY `idx_search_parcels_ADDRESS` (`ADDRESS`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `search_streets` (
  `ogr_fid` int(11) NOT NULL,
  `streetname` varchar(32) DEFAULT NULL,
  `shape` geometry NOT NULL /*!80003 SRID 0 */,
  PRIMARY KEY (`ogr_fid`),
  SPATIAL KEY `idx_search_streets_shape` (`shape`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
