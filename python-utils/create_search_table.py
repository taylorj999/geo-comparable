import argparse
import sys
import datetime
import mysql.connector
import json

# parse the command line arguments
parser = argparse.ArgumentParser()
parser.add_argument('--dbhost',action='store', required=True,
                    help='IP address of the database')
parser.add_argument('--dbname',action='store', required=True,
                    help='Name of the database schema')
parser.add_argument('--dbuser',action='store', required=True,
                    help='Database user name (requires update/insert privs to the chosen schema)')
parser.add_argument('--dbpass',action='store', required=True,
                    help='Database password for given username')
parser.add_argument('--limit',action='store_true',
                    help='For testing purposes, only execute the script for the first valid property')
args = parser.parse_args()

if args.dbhost == None or args.dbname == None or args.dbuser == None or args.dbpass == None:
    sys.exit("Missing arguments");

conn = mysql.connector.connect(
  host=args.dbhost,
  database=args.dbname,
  user=args.dbuser,
  passwd=args.dbpass
)

cursor = conn.cursor(buffered=True)

query = ("SELECT ogr_fid, st_asgeojson(shape), COALESCE(housenumbe,''), COALESCE(numbersuff,''), COALESCE(direction,''), COALESCE(streetname,''), COALESCE(streettype,'') FROM parcels WHERE ogr_fid NOT IN (SELECT ogr_fid FROM search_parcels)")

if args.limit == True:
    query += " LIMIT 1"

cursor.execute(query, ())

for (fid, shape, housenumbe, numbersuff, direction, streetname, streettype) in cursor:
    thejson = json.loads(shape)
    if thejson['type'] != "MultiPolygon" and thejson['type'] != 'Polygon':
        exit("Unexpected type detected: " + thejson['type'])
    sum = float(0.0)
    vsum = [0,0]
    # check for extremely complicated property lots with multiple parts
    # if we detect the 'MultiPolygon' type it means that the arrays of points are themselves in an array
    # so the various polygons need to be combined into one big array
    pointlist = []
    if thejson['type'] == "MultiPolygon":
        for (j) in range(0,len(thejson['coordinates'][0])):
            pointlist += thejson['coordinates'][0][j]
    else:
        pointlist = thejson['coordinates'][0]
#        print json.dumps(pointlist, sort_keys=True, indent=4, separators=(',', ': '))

    # "Center of gravity" formula for a polygon of arbitrary shape given x,y coordinate pairs
    for (i) in range(0,len(pointlist)):
        p1 = pointlist[i]
        p2 = pointlist[(i+1) % len(pointlist[0])]
        x1 = float(p1[0])
        x2 = float(p2[0])
        y1 = float(p1[1])
        y2 = float(p2[1])
        cross = float(x1*y2 - y1*x2)
        sum += cross
        vsum[0] += ((x1+x2)*cross)
        vsum[1] += ((y1+y2)*cross)
    z = float(1.0) / (float(3.0) * sum)
    vsum[0] = vsum[0] * z
    vsum[1] = vsum[1] * z
    pointstr = "POINT(" + format(vsum[0],'3.13f') + " " + format(vsum[1],'3.13f') + ")"
#    print format(vsum[0],'3.13f')
#    print format(vsum[1],'3.13f')
    
    # 'housenumbe' is cut off due to the field name limit in the original GIS data
    address = housenumbe
    if len(numbersuff) > 0:
        address = address + " " + numbersuff
    if len(direction) > 0:
        address = address + " " + direction
    if len(streetname) > 0:
        address = address + " " + streetname
    if len(streettype) > 0:
        address = address + " " + streettype
    
    upsertquery = ("INSERT INTO search_parcels (ogr_fid, address, centerpoint, shape) VALUES (%s, %s, ST_GeomFromText(%s), ST_GeomFromGeoJson(%s)) " +
                   "ON DUPLICATE KEY UPDATE address = %s, centerpoint = ST_GeomFromText(%s), shape = ST_GeomFromGeoJson(%s)")
    upsertcursor = conn.cursor()
    upsertcursor.execute(upsertquery,(fid, address, pointstr, shape, address, pointstr, shape))
    conn.commit()
    upsertcursor.close()
    
cursor.close()
conn.close()