# Geo-Comparable Demo

A demonstration program for serving property comparison information in graphical form.

## Requirements
* MySQL 5.7 or higher
* (on Windows) NodeJS v8.16.0
* (on Linux) NodeJS v10.16.0
* GDAL v2.2.3 or higher (for the ogr2ogr data import program)

## Installation

### Data Loading

The demo expects to run against a MySQL database loaded with geospatial property data. It was tested against the 
database from Buncombe County, North Carolina primarily because Buncombe County provides access to all of their data for development purposes without requiring any access agreement.

The following procedure will load a set of geospatial data and set up the view tables necessary for the program to run.

1. Install the GDAL toolset from [gisinternals.com](http://www.gisinternals.com/release.php). GDAL includes a data loader program called ogr2ogr which is used to import the data into MYSQL.
2. Download a set of GIS data, for example [Buncombe County's](https://www.buncombecounty.org/Governing/Depts/GIS/download-digital-data.aspx#downloadable-data). Both the Parcels and Street Centerlines ZIP files should be downloaded.
  * Note: County GIS data typically cannot be redistributed or used in a production environment without a data access agreement.
3. Extract the shapefiles `.shp` from parcels and street centerlines zip files.
4. On windows, ogr2ogr requires the `GDAL_DATA` environment variable to be set, pointing to where-ever GDAL was installed, for example: `setx GDAL_DATA "C:\Program Files\GDAL\gdal-data"`
5. The loader syntax for ogr2ogr is as follows:
`ogr2ogr -f "MySQL" MYSQL:"SCHEMANAME,host=localhost,user=USER,password=PASSWORD,port=3306" -nln "TABLENAME" -t_srs "EPSG:4326" C:\Development\gis\file_to_import.shp`
  * `SCHEMANAME` should be replaced with the schema in your MySQL database to import the data into.
  * `USER` and `PASSWORD` need to be replaced with access credentials which have write access to the schema defined in `SCHEMANAME`.
  * `TABLENAME` is the name of the table to import into. For property data this should be `parcels` and for street data this should be `streets`. These tables will be automatically created by ogr2ogr and do not need to be created prior to data loading.
  * The option `-t_srs "ESPG:4326"` ensures the data is imported in Lat/Long coordinates
  * The option `-skipfailures` ensures the program does not abort on encountering any strangely defined or extremely large property parcels (such as, for example, a state park). 
  * ogr2ogr does not use significant memory or processor time however the data load process can take about an hour for a county's worth of property data.
6. Run the `.sql` files in `geo-comparable/database`:
  * `table_setup.sql` creates the 3 "materialized view" tables.
  * `f_create_full_address.sql`
  * `build_search_parcels_mv.sql` initially populates the parcels view
  * `build_search_streets_mv.sql` initially populates the streets view
  * `p_upsertonesearchparcelsrow.sql` is used for the update trigger on parcels
  * `triggers.sql`
  * `p_parcelsinproximity.sql`
  * `p_streetsinproximity.sql`

### Node Setup
1. Clone the repo: `git clone https://github.com/taylorj999/geo-comparable.git`
2. **LINUX ONLY**: Modify `package.json` to replace `"mapnik": "3.6.2"` with `mapnik: "4.7.2"`
3. Run `npm i` to install required packages.
4. Modify `geo-comparable/src/server/config/config.js` with the location of the database you are using, the login credentials for the user account (which will need select and execute permissions), and the port you wish to run the program on.
5. Run `npm test datasource` to verify you can connect to the database. (Or `npm test` to run all tests.)
6. Run `npm run build` to build the application.
7. Start the application with `npm start`
8. By default, the application will run on `http://localhost:3011/` or on the port you specified in step 4.