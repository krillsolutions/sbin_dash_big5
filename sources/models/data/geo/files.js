import {geo_files_loc} from "models/referential/genReferentials";
export const world_promise = d3.json('static/map/'+geo_files_loc.world);


//export const zone0_promise = d3.json('static/map/zone0/'+geo_files_loc.zone0);


export const file_ref = geo_files_loc.zone_ref;

export const zones_ref = geo_files_loc.zone_levels;
