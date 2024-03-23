var roomMetadata =
{"general": {"floor_distance": 66, "max_rooms": 128 },
"rooms": [

{"id": "cc", "image": "cross-connector", "name": "room.cross.connector", "category": "category.connectors", "prereq": null, "capacity": -10, "energy": -3, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -16, "y1": -7, "x2": 16, "y2": 7, "floor": 0, "ceil": 8},
		{"x1": -7, "y1": -16, "x2": 7, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "cs", "image": "straight-hallway", "name": "room.straight.hallway", "category": "category.connectors", "prereq": null, "capacity": -1, "energy": -1, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -7, "y1": -8, "x2": 7, "y2": 8, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 8, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -8, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "16-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "cx", "image": "extended-straight-hallway", "name": "room.extended.straight.hallway", "category": "category.connectors", "prereq": null, "capacity": -2, "energy": -2, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -7, "y1": -16, "x2": 7, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "ct", "image": "t-shaped-connector", "name": "room.t.shaped.connector", "category": "category.connectors", "prereq": null, "capacity": -5, "energy": -2, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -7, "y1": -16, "x2": 7, "y2": 16, "floor": 0, "ceil": 8},
		{"x1": -7, "y1": -7, "x2": 16, "y2": 7, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-3",
	"blockedFromAboveBy": [
	    ]},
{"id": "cb", "image": "elbow-connector", "name": "room.elbow.connector", "category": "category.connectors", "prereq": null, "capacity": -1, "energy": -1, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -4, "y1": -4, "x2": 16, "y2": 7, "floor": 0, "ceil": 8},
		{"x1": -4, "y1": -4, "x2": 7, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-2e",
	"blockedFromAboveBy": [
	    ]},
{"id": "ce", "image": "elevator-bottom", "name": "room.elevator", "category": "category.connectors", "prereq": null, "capacity": -2, "energy": -2, "maxnum": null, "floor": -24, "ceil": 16, "multifloor": true,
	"bounds": [
		{"x1": -7, "y1": -10, "x2": 7, "y2": 12, "floor": -24, "ceil": 80}],
	"doors": [
		{"x": 0, "y": 12, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": 12, "floor": 1, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "elevator-bottom", "marker_images": [{"image": "marker-elevator-bottom", "x": 0, "y": 0}]},
		{"floor": 1, "image": "elevator-bottom", "marker_images": [{"image": "marker-elevator-top", "x": 0, "y": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "el-2",
	"blockedFromAboveBy": [
	    ]},

{"id": "h1", "image": "clan-hall", "name": "room.clan.hall", "category": "category.classic.halls", "prereq": null, "capacity": 100, "energy": 5, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": -12, "ceil": 24},
		{"x1": -17, "y1": -16, "x2": 17, "y2": 16, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"floor_images": [
		{"floor": 0, "image": "clan-hall", "marker_images": [{"image": "marker-console", "x": -1, "y": 12, "rot": 0}]}],
	"resources": [],
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "h2", "image": "clan-great-hall", "name": "room.clan.great.hall", "category": "category.classic.halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -17, "y1": -32, "x2": 17, "y2": 32, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"floor_images": [
		{"floor": 0, "image": "clan-great-hall", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "resource.nano.spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "resource.forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "h3", "image": "clan-greater-hall", "name": "room.clan.greater.hall", "category": "category.classic.halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -24, "y1": -32, "x2": 24, "y2": 32, "floor": -12, "ceil": 24},
		{"x1": -40, "y1": -12, "x2": 40, "y2": 12, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"floor_images": [
		{"floor": 0, "image": "clan-greater-hall", "marker_images": [{"image": "marker-console", "x": 1, "y": -28, "rot": 180}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "resource.nano.spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "resource.forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "h4", "image": "clan-grand-hall", "name": "room.clan.grand.hall", "category": "category.classic.halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 30,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -8, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "clan-grand-hall", "marker_images": [{"image": "marker-console", "x": 1, "y": -28, "rot": 180}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "resource.nano.spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "resource.forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "h-6",
	"blockedFromAboveBy": [
	    ]},
{"id": "h5", "image": "clan-grandest-hall", "name": "room.clan.grandest.hall", "category": "category.classic.halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 30,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -8, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "clan-grandest-hall", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "resource.nano.spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "resource.forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "h-6",
	"blockedFromAboveBy": [
	    ]},
{"id": "hi", "image": "inspiration-hall", "name": "room.inspiration.hall", "category": "category.classic.halls", "prereq": null, "capacity": 100, "energy": -1, "maxnum": 3, "spawn": true, "floor": -12, "ceil": 46,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 46}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "inspiration-hall", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]},
		{"floor": 1, "image": "inspiration-hall-other"}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.alloy.plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "resource.rubedo", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "resource.forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ce","ob","oc","re","ef", "ot", "gc", "dc"]},


{"id": "dc", "image": "duviri-cave", "name": "room.duviri.cave", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -22, "ceil": 36,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -22, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "duviri-cave", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": ["ob"]},
{"id": "ef", "image": "earth-forest", "name": "room.earth.forest.chamber", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -22, "ceil": 68,
	"bounds": [
		{"x1": -31.5, "y1": -63.5, "x2": 31.5, "y2": 63.5, "floor": -22, "ceil": 68},
		{"x1": -32, "y1": -40, "x2": 32, "y2": -56, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 56, "x2": 32, "y2": 40, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -64, "x2": 8, "y2": 64, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 64, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 48, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -48, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -64, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -48, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 48, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "earth-forest", "marker_images": [{"image": "marker-console", "x": 1, "y": -60, "rot": 180}]},
		{"floor": 1, "image": "earth-forest-other"}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-10",
	"blockedFromAboveBy": []},
{"id": "he", "image": "entrati-hall", "name": "room.entrati.audience.chamber", "category": "category.theme.halls", "spawn": true, "prereq": null, "capacity": 200, "energy": -2, "maxnum": null, "floor": -12, "ceil": 32,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -12, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "entrati-hall", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "gc", "image": "galleon-chamber", "name": "room.galleon.chamber", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -26, "ceil": 34,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -26, "ceil": 34},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "galleon-chamber", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "hf", "image": "infested-hall", "name": "room.infested.chamber", "category": "category.theme.halls", "spawn": true, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -12, "ceil": 32,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -12, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "infested-hall", "marker_images": [{"image": "marker-console", "x": 1, "y": -28, "rot": 180}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},

{"id": "ka", "image": "kuva-asteroid", "name": "room.kuva.asteroid", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -4, "ceil": 32,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -8, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "kuva-asteroid", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "ot", "image": "orokin-tower", "name": "room.orokin.tower.chamber", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -32, "ceil": 70,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -32, "ceil": 70},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "orokin-tower", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]},
		{"floor": 1, "image": "orokin-tower-other"}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": []},
{"id": "co", "image": "ostron-cove", "name": "room.ostron.cove", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -12, "ceil": 32,
	"bounds": [
		{"x1": -31.5, "y1": -38, "x2": 31.5, "y2": 31.5, "floor": -12, "ceil": 32},
		{"x1": -31, "y1": -86, "x2": 31, "y2": -38, "floor": -12, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": 32, "x2": 8, "y2": 24, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "ostron-cove", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-5",
	"blockedFromAboveBy": []},
{"id": "sm", "image": "starlight-market", "name": "room.starlight.market", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -12, "ceil": 32,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -12, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "starlight-market", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "uc", "image": "uranus-chamber", "name": "room.uranus.chamber", "category": "category.theme.halls", "spawn": false, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -20, "ceil": 32,
	"bounds": [
		{"x1": -31.5, "y1": -31.5, "x2": 31.5, "y2": 31.5, "floor": -20, "ceil": 32},
		{"x1": -32, "y1": -24, "x2": 32, "y2": -8, "floor": 0, "ceil": 8},
		{"x1": -32, "y1": 8, "x2": 32, "y2": 24, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "uranus-chamber", "marker_images": [{"image": "marker-console", "x": -1, "y": 28, "rot": 0}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},

{"id": "or", "image": "oracle2", "name": "room.oracle", "category": "category.labs", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -8, "ceil": 12, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -14, "x2": 14, "y2": 15, "floor": -8, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 15, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.polymer.bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lt", "image": "tenno-lab2", "name": "room.tenno.lab", "category": "category.labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 8, "xp": 10000,
	"bounds": [
		{"x1": -11, "y1": -10, "x2": 11, "y2": 9, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 9, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "tenno-lab2", "marker_images": [{"image": "marker-lab-tenno", "x": 0, "y": 8}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.polymer.bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "16-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "le", "image": "energy-lab", "name": "room.energy.lab", "category": "category.labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 16, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -15, "x2": 14, "y2": 14, "floor": 0, "ceil": 16}],
	"doors": [
		{"x": 0, "y": 14, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "energy-lab", "marker_images": [{"image": "marker-lab-energy", "x": 0, "y": 13}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.polymer.bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lc", "image": "chem-lab", "name": "room.chem.lab", "category": "category.labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": -16, "ceil": 16, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -15, "x2": 14, "y2": 16, "floor": -16, "ceil": 16}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "chem-lab", "marker_images": [{"image": "marker-lab-chem", "x": 0, "y": 15}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.polymer.bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lb", "image": "bio-lab", "name": "room.bio.lab", "category": "category.labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 12, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -15, "x2": 14, "y2": 14, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 14, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "bio-lab", "marker_images": [{"image": "marker-lab-bio", "x": 0, "y": 13}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.polymer.bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lo", "image": "orokin-lab", "name": "room.orokin.lab", "category": "category.labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": -16, "ceil": 28, "xp": 10000,
	"bounds": [
		{"x1": -16, "y1": -28, "x2": 16, "y2": 26, "floor": -16, "ceil": 28}],
	"doors": [
		{"x": 0, "y": 26, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "orokin-lab", "marker_images": [{"image": "marker-lab-orokin", "x": 0, "y": 25}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.polymer.bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 20]}],
    "treetype": "64-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lv", "image": "ventkid-lab", "name": "room.ventkids.bash.lab", "category": "category.labs", "prereq": "lt", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 8, "xp": 10000,
	"bounds": [
		{"x1": -8, "y1": -10, "x2": 8, "y2": 8, "floor": 0, "ceil": 8},
		{"x1": -2, "y1": -15, "x2": 2, "y2": -10, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 8, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "ventkid-lab", "marker_images": [{"image": "marker-ventkid-lab", "x": 0, "y": 8}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [450, 1350, 4500, 13500, 45000]},
		{"resource": "resource.circuits", "costs": [250, 750, 2500, 7500, 25000]},
		{"resource": "resource.thermal.sludge", "costs": [100, 300, 1000, 3000, 10000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "16-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "ld", "image": "dagath-lab", "name": "room.dagaths.hollow", "category": "category.labs", "prereq": "lt", "capacity": -2, "energy": -5, "maxnum": null, "floor": -8, "ceil": 30, "xp": 10000,
	"bounds": [
		{"x1": -5, "y1": 19, "x2": 5, "y2": 27, "floor": 0, "ceil": 8},
		{"x1": -23, "y1": -28, "x2": 23, "y2": 19, "floor": -8, "ceil": 30}],
	"doors": [
		{"x": 0, "y": 27, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "dagath-lab", "marker_images": [{"image": "marker-dagath-lab", "x": 0, "y": 27}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.alloy.plate", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.cryotic", "costs": [100, 300, 1000, 3000, 10000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "64-1",
	"blockedFromAboveBy": [
	    ]},

{"id": "dd", "image": "dry-dock", "name": "room.dry.dock", "category": "category.interactive", "prereq": null, "capacity": -20, "energy": -6, "maxnum": 1, "floor": -80, "ceil": 200,
	"bounds": [
//		{"x1": -128, "y1":  -128, "x2": 128, "y2":  128, "floor": -80, "ceil": 200},
		{"x1": -127.5, "y1":  -128,   "x2": 127.5, "y2":  127.5, "floor": -80,  "ceil": 200},
		{"x1": -128,   "y1":   -16,   "x2": 128,   "y2":   16,   "floor":  0,   "ceil": 32},
		{"x1":  -16,   "y1":   128,   "x2":  16,   "y2":   96,   "floor":  0,   "ceil": 32},
		{"x1": -127.5, "y1": -1279.5, "x2": 127.5, "y2":  -95.5, "floor": -200, "ceil": 200, "invis": "true"}],
	"doors": [
		{"x": 0, "y": 128, "floor": 0, "outx": 0, "outy": 1},
		{"x": 128, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": -128, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": -1, "image": "dry-dock-wall"},
		{"floor": 0, "image": "dry-dock", "marker_images": [
			{"image": "marker-railjack-summon", "x": 0, "y": 48},
			{"image": "marker-railjack-lab", "x": 35, "y": 43},
			{"image": "marker-railjack-config", "x": 43, "y": 35},
			{"image": "marker-railjack-board", "x": 15.25, "y": -29.75},
			{"image": "marker-railjack-board", "x": -15.25, "y": -29.75}
		]},
		{"floor": 1, "image": "dry-dock-wall"},
		{"floor": 2, "image": "dry-dock-wall"},
		{"floor": 3, "image": "dry-dock-wall"}],
	"resources": [
		{"resource": "resource.credits", "costs": [100000, 300000, 1000000, 3000000, 10000000]},
		{"resource": "resource.salvage", "costs": [25000, 75000, 250000, 750000, 2500000]},
		{"resource": "resource.circuits", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "resource.tellurium", "costs": [15, 45, 150, 450, 1500]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "dd",
	"blockedFromAboveBy": [
	    ]},
{"id": "cr", "image": "crimson-branch", "name": "room.crimson.branch", "category": "category.interactive", "prereq": null, "capacity": -2, "energy": -4, "maxnum": null, "floor": 0, "ceil": 12,
	"bounds": [
		{"x1": -30, "y1":  1, "x2": 30, "y2": -28, "floor": 0, "ceil": 12},
		{"x1": -16, "y1": 16, "x2": 16, "y2": -28, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [100000, 300000, 1000000, 3000000, 10000000]},
		{"resource": "resource.hexenon", "costs": [250, 750, 2500, 7500, 25000]},
		{"resource": "resource.alloy.plate", "costs": [8500, 25500, 85000, 255000, 850000]},
		{"resource": "resource.orokin.cell", "costs": [25, 75, 250, 750, 2500]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "du", "image": "dueling-room", "name": "room.dueling.room", "category": "category.interactive", "prereq": null, "capacity": -10, "energy": -10, "maxnum": null, "floor": 0, "ceil": 20, "xp": 15000,
	"bounds": [
		{"x1": -16, "y1": -15.5, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "dueling-room", "marker_images": [{"image": "marker-duel", "x": 0, "y": 14}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.nano.spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "oc", "image": "obstacle-course", "name": "room.obstacle.course", "category": "category.interactive", "prereq": null, "capacity": -10, "energy": -10, "maxnum": null, "floor": -24, "ceil": 24, "xp": 15000,
	"bounds": [
		{"x1": -82, "y1": -98, "x2": 82, "y2": 94, "floor": -24, "ceil": 24},
		{"x1": -8, "y1": 94, "x2": 8, "y2": 98, "floor": -24, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 98, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "obstacle-course", "marker_images": [
		    {"image": "marker-obstacle", "x": 0, "y": 78},
		    {"image": "marker-obstacle-course-fog-plane", "x": 0, "y": -8, "z": -5, "rot": 0, "nonclickable": true}
        ]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.alloy.plate", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [400, 1200, 4000, 12000, 40000]},
		{"resource": "resource.rubedo", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "oc-1",
	"blockedFromAboveBy": []},
{"id": "oa", "image": "obstacle-course-architect", "name": "room.obstacle.course.architect", "category": "category.interactive", "prereq": null, "capacity": 0, "energy": -2, "maxnum": 5, "floor": 0, "ceil": 50, "xp": 15000,
	"bounds": [
		{"x1": -76, "y1": -78, "x2": 76, "y2": 72, "floor": 0, "ceil": 50},
		{"x1": -6, "y1": 72, "x2": 6, "y2": 82, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "obstacle-course-architect", "marker_images": [{"image": "marker-obstacle", "x": 0, "y": 72}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "resource.nano.spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}], "unverified": true,
    "treetype": "os-1",
	"blockedFromAboveBy": [
		"ob","oc","re","ce","ef","uc","t4","ot","gc","dc"]},

{"id": "ob", "image": "observatory", "name": "room.observatory", "category": "category.misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -36, "ceil": 52,
	"bounds": [
		{"x1": -50, "y1": -74, "x2": 50, "y2": 73, "floor": -36, "ceil": 52},
		{"x1": -6, "y1": 72, "x2": 6, "y2": 80, "floor": -32, "ceil": 52}],
	"doors": [
		{"x": 0, "y": 80, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 2, 5, 15]}], "unverified": true,
    "treetype": "ob-1",
	"blockedFromAboveBy": [
		"lc","ce","ob","oc","lo","re","uc","ef","t4","ot","gc","dc"]},
{"id": "th", "image": "temple-of-honor", "name": "room.temple.of.honor", "category": "category.misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 20, "xp": 15000,
	"bounds": [
		{"x1": -32, "y1": -8, "x2": 32, "y2": 8, "floor": 0, "ceil": 20},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20},
		{"x1": -17, "y1": -17, "x2": 17, "y2": 17, "floor": 8, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.alloy.plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "os", "image": "open-space", "name": "room.open.space", "category": "category.misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -60, "ceil": 80,
	"bounds": [
		{"x1": -76, "y1": -80, "x2": 76, "y2": 73, "floor": -64, "ceil": 80},
		{"x1": -6, "y1": 73, "x2": 6, "y2": 82, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": -1, "image": "open-space-other"},
		{"floor": 0, "image": "open-space"},
		{"floor": 1, "image": "open-space-other"}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "os-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "du1", "image": "duviri-courtier", "name": "room.courtiers.bliss", "category": "category.misc", "prereq": null, "capacity": 200, "energy": -5, "maxnum": 1, "floor": -12, "ceil": 18,
	"bounds": [
		{"x1": -16, "y1": -14, "x2": 16.5, "y2": 16, "floor": -12, "ceil": 18}
		// I can't find a cleaner way to express how this room does not fit directly against any room on the left
		// *except* for the freakin' Dry Dock
		//, {"x1": -16, "y1": -14, "x2": 16, "y2": 16, "floor": -12, "ceil": 18, "bespoke": ["dd"]}
		],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
    ]},
{"id": "du2", "image": "duviri-harbinger", "name": "room.harbingers.pass", "category": "category.misc", "prereq": null, "capacity": 200, "energy": -5, "maxnum": 1, "floor": -12, "ceil": 18,
	"bounds": [
		{"x1": -16, "y1": -32, "x2": 16.5, "y2": 16, "floor": -12, "ceil": 18}
		// I can't find a cleaner way to express how this room does not fit directly against any room on the left
		// *except* for the freakin' Dry Dock
		//, {"x1": -16, "y1": -32, "x2": 16, "y2": 16, "floor": -12, "ceil": 18, "bespoke": ["dd"]}
		],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "resource.salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
    ]},

{"id": "gsa", "image": "small-garden", "name": "room.small.garden.aestas", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gsu", "image": "small-garden", "name": "room.small.garden.autumn", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gsc", "image": "small-garden", "name": "room.small.garden.castitas", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gse", "image": "small-garden", "name": "room.small.garden.equinox", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gsh", "image": "small-garden", "name": "room.small.garden.humilitias", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gsi", "image": "small-garden", "name": "room.small.garden.industria", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gss", "image": "small-garden", "name": "room.small.garden.stone", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gsw", "image": "small-garden", "name": "room.small.garden.wooden", "category": "category.gardens", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "resource.nano.spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "glc", "image": "large-garden", "name": "room.large.garden.caritas", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "resource.polymer.bundle", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.nano.spores", "costs": [2500, 7500, 25000, 75000, 250000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "glj", "image": "large-garden", "name": "room.large.garden.junno", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "resource.polymer.bundle", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.nano.spores", "costs": [2500, 7500, 25000, 75000, 250000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gll", "image": "large-garden", "name": "room.large.garden.leto", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "resource.ferrite", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.nano.spores", "costs": [2500, 7500, 25000, 75000, 250000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "glm", "image": "large-garden", "name": "room.large.garden.mosaic", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.nano.spores", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.plastids", "costs": [10, 30, 100, 300, 1000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gls", "image": "large-garden", "name": "room.large.garden.soleto", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.nano.spores", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.polymer.bundle", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "resource.rubedo", "costs": [10, 30, 100, 300, 1000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "glt", "image": "large-garden", "name": "room.large.garden.temperantia", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "resource.ferrite", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.nano.spores", "costs": [2500, 7500, 25000, 75000, 250000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "glv", "image": "large-garden", "name": "room.large.garden.vosen", "category": "category.gardens", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -4, "x2": 32, "y2": 4, "floor": 0, "ceil": 20},
		{"x1": -4, "y1": -32, "x2": 4, "y2": 32, "floor": 0, "ceil": 20},
		{"x1": -24, "y1": -24, "x2": 24, "y2": 24, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "resource.salvage", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "resource.ferrite", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "resource.nano.spores", "costs": [2500, 7500, 25000, 75000, 250000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},

{"id": "re", "image": "reactor", "name": "room.reactor", "category": "category.utility", "prereq": null, "capacity": -5, "energy": 25, "maxnum": null, "floor": -28, "ceil": 36,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": -28, "ceil": 36}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "resource.credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "resource.salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "resource.circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "resource.alloy.plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
		"ob","ot"]},
{"id": "t1", "image": "barracks", "iconImage": "barracks1", "name": "room.shadow.barracks", "category": "category.utility", "prereq": null, "capacity": -1, "energy": -1, "maxnum": 1, "floor": -6, "ceil": 12, "tier": 1,
	"bounds": [
		{"x1": -16, "y1": -18, "x2": 16, "y2": 18, "floor": -6, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 18, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "barracks", "marker_images": [{"image": "marker-barracks-1", "x": 0, "y": 6}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [1000, 1000, 1000, 1000, 1000]},
		{"resource": "resource.alloy.plate", "costs": [150, 150, 150, 150, 150]},
		{"resource": "resource.ferrite", "costs": [600, 600, 600, 600, 600]},
		{"resource": "resource.rubedo", "costs": [300, 300, 300, 300, 300]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 1]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "t2", "image": "barracks", "iconImage": "barracks2", "name": "room.storm.barracks", "category": "category.utility", "prereq": "t1", "capacity": -1, "energy": -1, "maxnum": 1, "floor": -6, "ceil": 12, "tier": 2,
	"bounds": [
		{"x1": -16, "y1": -18, "x2": 16, "y2": 18, "floor": -6, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 18, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "barracks", "marker_images": [{"image": "marker-barracks-2", "x": 0, "y": 6}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [3000, 3000, 3000, 3000, 3000]},
		{"resource": "resource.alloy.plate", "costs": [450, 450, 450, 450, 450]},
		{"resource": "resource.ferrite", "costs": [1800, 1800, 1800, 1800, 1800]},
		{"resource": "resource.rubedo", "costs": [900, 900, 900, 900, 900]},
		{"resource": "resource.forma", "costs": [1, 1, 1, 1, 1]}], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "t3", "image": "barracks", "iconImage": "barracks3", "name": "room.mountain.barracks", "category": "category.utility", "prereq": "t2", "capacity": -1, "energy": -1, "maxnum": 1, "floor": -12, "ceil": 12, "tier": 3,
	"bounds": [
		{"x1": -16, "y1": -18, "x2": 16, "y2": 18, "floor": -12, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 18, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "barracks", "marker_images": [{"image": "marker-barracks-3", "x": 0, "y": 6}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [10000, 10000, 10000, 10000, 10000]},
		{"resource": "resource.alloy.plate", "costs": [1500, 1500, 1500, 1500, 1500]},
		{"resource": "resource.ferrite", "costs": [6000, 6000, 6000, 6000, 6000]},
		{"resource": "resource.rubedo", "costs": [3000, 3000, 3000, 3000, 3000]},
		{"resource": "resource.forma", "costs": [3, 3, 3, 3, 3]}], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "t4", "image": "barracks", "iconImage": "barracks4", "name": "room.moon.barracks", "category": "category.utility", "prereq": "t3", "capacity": -1, "energy": -1, "maxnum": 1, "floor": -18, "ceil": 12, "tier": 4,
	"bounds": [
		{"x1": -16, "y1": -18, "x2": 16, "y2": 18, "floor": -18, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 18, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "barracks", "marker_images": [{"image": "marker-barracks-4", "x": 0, "y": 6}]}],
	"resources": [
		{"resource": "resource.credits", "costs": [100000, 100000, 100000, 100000, 100000, 100000, ]},
		{"resource": "resource.alloy.plate", "costs": [15000, 15000, 15000, 15000, 15000]},
		{"resource": "resource.ferrite", "costs": [60000, 60000, 60000, 60000, 60000]},
		{"resource": "resource.rubedo", "costs": [3000, 3000, 3000, 3000, 3000]},
		{"resource": "resource.forma", "costs": [25, 25, 25, 25, 25]}], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "la", "image": "label", "name": "room.label", "category": "category.utility", "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": 0, "ceil": 0, "num": 0, "defaultLabel": "room.label",
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20, "ignore": true}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [],
	"blockedFromAboveBy": []},

{"id": "oh1", "image": "old-hall", "name": "room.old.clan.hall", "category": "category.discontinued", "discontinued": true, "spawn": true, "prereq": null, "capacity": 100, "energy": 5, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -18.25, "y1": -32.25, "x2": 18.25, "y2": 1.75, "floor": -8, "ceil": 24},
		{"x1": -26, "y1": 1.75, "x2": 26, "y2": 32.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32.25, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "oh2", "image": "old-great-hall", "name": "room.old.clan.great.hall", "category": "category.discontinued", "discontinued": true, "spawn": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -35, "y1": -32, "x2": 35, "y2": 32, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "occ", "image": "old-cross-connector", "name": "room.old.cross.connector", "category": "category.discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -18.25, "y1": -18.25, "x2": 18.25, "y2": 18.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 18.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 18.25, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -18.25, "floor": 0, "outx": 0, "outy": -1},
		{"x": -18.25, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [], "unverified": true,
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "oct", "image": "old-t-connector", "name": "room.old.t.shaped.connector", "category": "category.discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -8.25, "y1": -18.25, "x2": 18.25, "y2": 18.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 18.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 18.25, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -18.25, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "32-3",
	"blockedFromAboveBy": [
	    ]},
{"id": "osh", "image": "old-straight-hallway", "name": "room.old.straight.hallway", "category": "category.discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -6, "y1": -6.25, "x2": 6, "y2": 6.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 6.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -6.25, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "16-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "oce", "image": "old-elbow-connector", "name": "room.old.elbow.connector", "category": "category.discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -8.25, "y1": -8.25, "x2": 18.25, "y2": 18.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 18.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 18.25, "y": 0, "floor": 0, "outx": 1, "outy": 0}],
		//{"x": 0, "y": -18.25, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "32-2e",
	"blockedFromAboveBy": [
	    ]},
{"id": "ore", "image": "old-reactor", "name": "room.old.reactor", "category": "category.discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 25, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -10, "y1": -15, "x2": 10, "y2": 15, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 15, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
]};

// metadata for structural tree display
// each image key is the bitmask of connected doors, going counterclockwise
var treeMetadata = {
    "16-1": {
        "1" : {"tree": true, "image": "tree-16-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "16-2": {
        "10" : {"tree": true, "image": "tree-16-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "01" : {"tree": true, "image": "tree-16-1", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "11" : {"tree": true, "image": "tree-16-2", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "32-1": {
        "1" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "32-2": {
        "10" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "01" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "11" : {"tree": true, "image": "tree-32-2a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "32-2e": {
        "10" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "01" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "11" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "32-3": {
        "100" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "010" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "001" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "101" : {"tree": true, "image": "tree-32-2a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "110" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "011" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "111" : {"tree": true, "image": "tree-32-3", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "32-4": {
        "1000" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0100" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "0010" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "0001" : {"tree": true, "image": "tree-32-1", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1010" : {"tree": true, "image": "tree-32-2a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0101" : {"tree": true, "image": "tree-32-2a", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1100" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0110" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "0011" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "1001" : {"tree": true, "image": "tree-32-2b", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1110" : {"tree": true, "image": "tree-32-3", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0111" : {"tree": true, "image": "tree-32-3", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "1011" : {"tree": true, "image": "tree-32-3", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "1101" : {"tree": true, "image": "tree-32-3", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1111" : {"tree": true, "image": "tree-32-4", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "64-1": {
        "1" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "64-2": {
        "10" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "01" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "11" : {"tree": true, "image": "tree-64-2a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "64-4": {
        "1000" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0100" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "0010" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "0001" : {"tree": true, "image": "tree-64-1", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1010" : {"tree": true, "image": "tree-64-2a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0101" : {"tree": true, "image": "tree-64-2a", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "1100" : {"tree": true, "image": "tree-64-2b", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0110" : {"tree": true, "image": "tree-64-2b", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "0011" : {"tree": true, "image": "tree-64-2b", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "1001" : {"tree": true, "image": "tree-64-2b", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1110" : {"tree": true, "image": "tree-64-3", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "0111" : {"tree": true, "image": "tree-64-3", "x": 0, "y": 0, "rot": 270, "fx": 0, "fy": 0, "z": 1 },
        "1011" : {"tree": true, "image": "tree-64-3", "x": 0, "y": 0, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "1101" : {"tree": true, "image": "tree-64-3", "x": 0, "y": 0, "rot": 90, "fx": 0, "fy": 0, "z": 1 },
        "1111" : {"tree": true, "image": "tree-64-4", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "h-6": {
        // pfft this was the *simpler* option
        // bottom half of a 6-door hall
        "a-0000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1000" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0010" : {"tree": true, "image": "tree-h-0", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1010" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1100" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0110" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0011" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1001" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1110" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0111" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1011" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1101" : {"tree": true, "image": "tree-h-4", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1111" : {"tree": true, "image": "tree-h-4", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        // top half of a 6-door hall, rotated 180
        "b-0000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-1000" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0010" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "b-1010" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-1100" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0110" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0011" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "b-1001" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "b-1110" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0111" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-1011" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "b-1101" : {"tree": true, "image": "tree-h-4", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-1111" : {"tree": true, "image": "tree-h-4", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        // split a 6-door key into two 4-door keys
        "convertKey": function(key) {
            // 6-door layout:
            //    0
            // 5     1
            // 4     2
            //    3
            //
            // gets split into:
            //
            //    0
            // 5     1
            //    X     (1 if 2|3|4, 0 otherwise)
            //
            //    X     (1 if 0|1|5, 0 otherwise)
            // 4     2
            //    3
            return [
                "a-" + key[0] + key[1] + (key.substring(2,5) == "000" ? "0" : "1") + key[5],
                "b-" + key[3] + key[4] + ((key.substring(5) + key.substring(0,2)) == "000" ? "0" : "1") + key[2]
            ];
        }
    },
    "h-10": {
        // Oh god how to break down 1023 possible door combinations
        // top quarter of a 10-door hall
        "a-1000" : {"tree": true, "image": "tree-he-2a", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0100" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0010" : {"tree": true, "image": "tree-he-0", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0001" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": 48, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1010" : {"tree": true, "image": "tree-he-2a", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0101" : {"tree": true, "image": "tree-he-3b", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1100" : {"tree": true, "image": "tree-he-3a", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0110" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0011" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": 48, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1001" : {"tree": true, "image": "tree-he-3a", "x": 0, "y": 48, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1110" : {"tree": true, "image": "tree-he-3a", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-0111" : {"tree": true, "image": "tree-he-3b", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1011" : {"tree": true, "image": "tree-he-3a", "x": 0, "y": 48, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1101" : {"tree": true, "image": "tree-he-4", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1111" : {"tree": true, "image": "tree-he-4", "x": 0, "y": 48, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        // middle top quarter of a 10-door hall
        "b-0000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-1000" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0010" : {"tree": true, "image": "tree-h-0", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "b-1010" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-1100" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0110" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0011" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "b-1001" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "b-1110" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-0111" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-1011" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "b-1101" : {"tree": true, "image": "tree-h-4", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "b-1111" : {"tree": true, "image": "tree-h-4", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        // middle top quarter of a 10-door hall, rotated 180
        "c-0000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-1000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0010" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "c-1010" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-1100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0110" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0011" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "c-1001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "c-1110" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-0111" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-1011" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "c-1101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "c-1111" : {"tree": true, "image": "tree-h-4", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        // top quarter of a 10-door hall, rotated 180
        "d-1000" : {"tree": true, "image": "tree-he-2a", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0100" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0010" : {"tree": true, "image": "tree-he-0", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0001" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": -48, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "d-1010" : {"tree": true, "image": "tree-he-2a", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0101" : {"tree": true, "image": "tree-he-3b", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-1100" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0110" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0011" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": -48, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "d-1001" : {"tree": true, "image": "tree-he-2b", "x": 0, "y": -48, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "d-1110" : {"tree": true, "image": "tree-he-3a", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-0111" : {"tree": true, "image": "tree-he-3b", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-1011" : {"tree": true, "image": "tree-he-3a", "x": 0, "y": -48, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "d-1101" : {"tree": true, "image": "tree-he-3b", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "d-1111" : {"tree": true, "image": "tree-he-4", "x": 0, "y": -48, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        // split a 10-door key into four 4-door keys
        "convertKey": function(key) {
            // 10-door layout:
            //    0
            // 9     1
            // 8     2
            // 7     3
            // 6     4
            //    5
            //
            // gets split into:
            //
            //    0
            // 9     1
            //    X     (1 if 0|1|9, 0 otherwise)
            //
            //    X     (1 if 0|1|9, 0 otherwise)
            // 8     2
            //    X     (1 if it's connected to anything, 0 otherwise)
            //
            //    X     (1 if it's connected to anything, 0 otherwise)
            // 7     3
            //    X     (1 if 4|6|5, 0 otherwise)
            //
            //    X     (1 if 4|6|5, 0 otherwise)
            // 6     4
            //    5
            return [
                "a-" +
                    key[0] +
                    key[9] +
                    ((key[0]+key[1]+key[9]) == "000" ? "0" : "1") +
                    key[1],
                "b-" +
                    ((key[0]+key[1]+key[9]) == "000" ? "0" : "1") +
                    key[2] +
                    (key.includes("1") ? "1" : 0) +
                    key[8],
                "c-" +
                    (key.includes("1") ? "1" : 0) +
                    key[7] +
                    ((key[4]+key[5]+key[6]) == "000" ? "0" : "1") +
                    key[3],
                "d-" +
                    ((key[4]+key[5]+key[6]) == "000" ? "0" : "1") +
                    key[6] +
                    key[5] +
                    key[4]
            ];
        }
    },
    "h-5": {
        // bottom half of a 5-door hall
        "a-0000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1000" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0010" : {"tree": true, "image": "tree-h-0", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1010" : {"tree": true, "image": "tree-h-2a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1100" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0110" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0011" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1001" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1110" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-0111" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1011" : {"tree": true, "image": "tree-h-3a", "x": 0, "y": 16, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "a-1101" : {"tree": true, "image": "tree-h-4", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "a-1111" : {"tree": true, "image": "tree-h-4", "x": 0, "y": 16, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        // top half of a 5-door hall, rotated 180
        "b-0000" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0100" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0010" : {"tree": true, "image": "tree-h-0", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0001" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "b-0101" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0110" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        "b-0011" : {"tree": true, "image": "tree-h-2b", "x": 0, "y": -16, "rot": 180, "fx": 1, "fy": 0, "z": 1 },
        "b-0111" : {"tree": true, "image": "tree-h-3b", "x": 0, "y": -16, "rot": 180, "fx": 0, "fy": 0, "z": 1 },
        // split a 6-door key into two 4-door keys
        "convertKey": function(key) {
            // 5-door layout:
            //    0
            // 4     1
            // 3     2
            //
            // gets split into:
            //
            //    0
            // 4     1
            //    X     (1 if 2|3, 0 otherwise)
            //
            //    X     (1 if 0|1|4, 0 otherwise)
            // 3     2
            //
            return [
                "a-" + key[0] + key[1] + (key.substring(2,4) == "00" ? "0" : "1") + key[4],
                "b-0" + key[3] + ((key.substring(4) + key.substring(0,2)) == "000" ? "0" : "1") + key[2]
            ];
        }
    },
    // of course dry dock is its own thing
    "dd": {
        "100" : {"tree": true, "image": "tree-dd-1a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "010" : {"tree": true, "image": "tree-dd-1b", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "001" : {"tree": true, "image": "tree-dd-1b", "x": 0, "y": 0, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "110" : {"tree": true, "image": "tree-dd-2a", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "011" : {"tree": true, "image": "tree-dd-2b", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
        "101" : {"tree": true, "image": "tree-dd-2a", "x": 0, "y": 0, "rot": 0, "fx": 1, "fy": 0, "z": 1 },
        "111" : {"tree": true, "image": "tree-dd-3", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    // 1-offs
    "oc-1": {
        "1" : {"tree": true, "image": "tree-oc-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "ob-1": {
        "1" : {"tree": true, "image": "tree-ob-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "os-1": {
        "1" : {"tree": true, "image": "tree-os-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "z": 1 },
    },
    "el-2": {
        "a-10" : {"tree": true, "image": "tree-el-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "floor": 0, "z": 1 },
        "b-10" : {"tree": true, "image": "tree-el-0", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "floor": 1, "z": 1 },
        "a-01" : {"tree": true, "image": "tree-el-0", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "floor": 0, "z": 1 },
        "b-01" : {"tree": true, "image": "tree-el-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "floor": 1, "z": 1 },
        "a-11" : {"tree": true, "image": "tree-el-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "floor": 0, "z": 1 },
        "b-11" : {"tree": true, "image": "tree-el-1", "x": 0, "y": 0, "rot": 0, "fx": 0, "fy": 0, "floor": 1, "z": 1 },
        "convertKey": function(key) {
            // need separate markers for each floor
            return ["a-" + key, "b-" + key];
        }
    },
};

// spark room marker, just put it in the center of the room
// add 1 to the ze index so it appears above tree structure markers
var spawnMarkerMetadata = {"image": "marker-spawn", "x": 0, "y": 0, "z": 2};

// spark point marker, just put it in the center of the room
// add 2 to the ze index so it appears above tree structure markers and spawn room marker
var ArrivalMarkerMetadata = {"image": "marker-arrival", "x": 0, "y": 0, "z": 3};
