var roomMetadata =
{"general": {"floor_distance": 64, "max_rooms": 128 },
"rooms": [

{"id": "cc", "image": "cross-connector", "name": "Cross Connector", "category": "Connectors", "prereq": null, "capacity": -10, "energy": -3, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -16, "y1": -7, "x2": 16, "y2": 7, "floor": 0, "ceil": 8},
		{"x1": -7, "y1": -16, "x2": 7, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "cs", "image": "straight-hallway", "name": "Straight Hallway", "category": "Connectors", "prereq": null, "capacity": -1, "energy": -1, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -7, "y1": -8, "x2": 7, "y2": 8, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 8, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -8, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "16-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "cx", "image": "extended-straight-hallway", "name": "Extended Straight Hallway", "category": "Connectors", "prereq": null, "capacity": -2, "energy": -2, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -7, "y1": -16, "x2": 7, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "ct", "image": "t-shaped-connector", "name": "T-shaped Connector", "category": "Connectors", "prereq": null, "capacity": -5, "energy": -2, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -7, "y1": -16, "x2": 7, "y2": 16, "floor": 0, "ceil": 8},
		{"x1": -7, "y1": -7, "x2": 16, "y2": 7, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-3",
	"blockedFromAboveBy": [
	    ]},
{"id": "cb", "image": "elbow-connector", "name": "Elbow Connector", "category": "Connectors", "prereq": null, "capacity": -1, "energy": -1, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -4, "y1": -4, "x2": 16, "y2": 7, "floor": 0, "ceil": 8},
		{"x1": -4, "y1": -4, "x2": 7, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-2e",
	"blockedFromAboveBy": [
	    ]},
{"id": "ce", "image": "elevator-bottom", "name": "Elevator", "category": "Connectors", "prereq": null, "capacity": -2, "energy": -2, "maxnum": null, "floor": -24, "ceil": 16, "multifloor": true,
	"bounds": [
		{"x1": -7, "y1": -11, "x2": 7, "y2": 12, "floor": -24, "ceil": 80}],
	"doors": [
		{"x": 0, "y": 12, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": 12, "floor": 1, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "elevator-bottom", "marker_images": [{"image": "marker-elevator-bottom", "x": 0, "y": 0}]},
		{"floor": 1, "image": "elevator-bottom", "marker_images": [{"image": "marker-elevator-top", "x": 0, "y": 0}]}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "el-2",
	"blockedFromAboveBy": [
	    ]},

{"id": "h1", "image": "clan-hall", "name": "Clan Hall", "category": "Halls", "prereq": null, "capacity": 100, "energy": 5, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": -12, "ceil": 24},
		{"x1": -17, "y1": -24, "x2": 17, "y2": 24, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [],
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "h2", "image": "clan-great-hall", "name": "Clan Great Hall", "category": "Halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -17, "y1": -32, "x2": 17, "y2": 32, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "h3", "image": "clan-greater-hall", "name": "Clan Greater Hall", "category": "Halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -24, "y1": -32, "x2": 24, "y2": 32, "floor": -12, "ceil": 24},
		{"x1": -40, "y1": -12, "x2": 40, "y2": 12, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "h4", "image": "clan-grand-hall", "name": "Clan Grand Hall", "category": "Halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 30,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 30}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "h-6",
	"blockedFromAboveBy": [
	    ]},
{"id": "h5", "image": "clan-grandest-hall", "name": "Clan Grandest Hall", "category": "Halls", "prereq": null, "capacity": 200, "energy": -2, "maxnum": 1, "spawn": true, "floor": -12, "ceil": 30,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 30}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "h-6",
	"blockedFromAboveBy": [
	    ]},
{"id": "hi", "image": "inspiration-hall", "name": "Inspiration Hall", "category": "Halls", "prereq": null, "capacity": 100, "energy": -1, "maxnum": 3, "spawn": true, "floor": -12, "ceil": 44,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 44}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"floor_images": [
		{"floor": 0, "image": "inspiration-hall"},
		{"floor": 1, "image": "inspiration-hall-other"}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Rubedo", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}],
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ce","ob","oc","re"]},
{"id": "he", "image": "entrati-hall", "name": "Entrati Audience Chamber", "category": "Halls", "spawn": true, "prereq": null, "capacity": 200, "energy": -2, "maxnum": null, "floor": -12, "ceil": 36,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 36}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "hf", "image": "infested-hall", "name": "Infested Chamber", "category": "Halls", "spawn": true, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -12, "ceil": 36,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 36}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "sm", "image": "starlight-market", "name": "Starlight Market", "category": "Halls", "spawn": true, "prereq": null, "capacity": 200, "energy": -5, "maxnum": null, "floor": -12, "ceil": 36,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 36}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "h-6",
	"blockedFromAboveBy": [
		"ob"]},

{"id": "or", "image": "oracle2", "name": "Oracle", "category": "Labs", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -8, "ceil": 12, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -15, "x2": 14, "y2": 15, "floor": -8, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 15, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lt", "image": "tenno-lab2", "name": "Tenno Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 8, "xp": 10000,
	"bounds": [
		{"x1": -10, "y1": -11, "x2": 10, "y2": 9, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 9, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "tenno-lab2", "marker_images": [{"image": "marker-lab-tenno", "x": 0, "y": 8}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "16-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "le", "image": "energy-lab", "name": "Energy Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 16, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -14, "x2": 14, "y2": 14, "floor": 0, "ceil": 16}],
	"doors": [
		{"x": 0, "y": 14, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "energy-lab", "marker_images": [{"image": "marker-lab-energy", "x": 0, "y": 13}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lc", "image": "chem-lab", "name": "Chem Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": -12, "ceil": 16, "xp": 10000,
	"bounds": [
		{"x1": -15, "y1": -15, "x2": 15, "y2": 16, "floor": -14, "ceil": 16}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "chem-lab", "marker_images": [{"image": "marker-lab-chem", "x": 0, "y": 15}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lb", "image": "bio-lab", "name": "Bio Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 12, "xp": 10000,
	"bounds": [
		{"x1": -14, "y1": -14, "x2": 14, "y2": 14, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 14, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "bio-lab", "marker_images": [{"image": "marker-lab-bio", "x": 0, "y": 13}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lo", "image": "orokin-lab", "name": "Orokin Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": -16, "ceil": 28, "xp": 10000,
	"bounds": [
		{"x1": -16, "y1": -28, "x2": 16, "y2": 26, "floor": -16, "ceil": 28}],
	"doors": [
		{"x": 0, "y": 26, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "orokin-lab", "marker_images": [{"image": "marker-lab-orokin", "x": 0, "y": 25}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 20]}],
    "treetype": "64-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "lv", "image": "ventkid-lab", "name": "Ventkids' Bash Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 8, "xp": 10000,
	"bounds": [
		{"x1": -8, "y1": -10, "x2": 8, "y2": 8, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 8, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "ventkid-lab", "marker_images": [{"image": "marker-ventkid-lab", "x": 0, "y": 8}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [450, 1350, 4500, 13500, 45000]},
		{"resource": "Circuits", "costs": [250, 750, 2500, 7500, 25000]},
		{"resource": "Thermal Sludge", "costs": [100, 300, 1000, 3000, 10000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "16-1",
	"blockedFromAboveBy": [
	    ]},

{"id": "dd", "image": "dry-dock", "name": "Dry Dock", "category": "Interactive", "prereq": null, "capacity": -20, "energy": -6, "maxnum": 1, "floor": -80, "ceil": 200,
	"bounds": [
		{"x1": -128, "y1":  -128, "x2": 128, "y2":  128, "floor": -72, "ceil": 200},
		{"x1": -128, "y1": -1272, "x2": 128, "y2":  -95, "floor": -200, "ceil": 200, "invis": "true"}],
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
		{"resource": "Credits", "costs": [100000, 300000, 1000000, 3000000, 10000000]},
		{"resource": "Salvage", "costs": [25000, 75000, 250000, 750000, 2500000]},
		{"resource": "Circuits", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "Tellurium", "costs": [15, 45, 150, 450, 1500]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "dd",
	"blockedFromAboveBy": [
	    ]},
{"id": "cr", "image": "crimson-branch", "name": "Crimson Branch", "category": "Interactive", "prereq": null, "capacity": -2, "energy": -4, "maxnum": null, "floor": 0, "ceil": 12,
	"bounds": [
		{"x1": -30, "y1":  1, "x2": 30, "y2": -30, "floor": 0, "ceil": 12},
		{"x1": -16, "y1": 16, "x2": 16, "y2": -30, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [100000, 300000, 1000000, 3000000, 10000000]},
		{"resource": "Hexenon", "costs": [250, 750, 2500, 7500, 25000]},
		{"resource": "Alloy Plate", "costs": [8500, 25500, 85000, 255000, 850000]},
		{"resource": "Orokin Cell", "costs": [25, 75, 250, 750, 2500]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "du", "image": "dueling-room", "name": "Dueling Room", "category": "Interactive", "prereq": null, "capacity": -10, "energy": -10, "maxnum": null, "floor": 0, "ceil": 20, "xp": 15000,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "dueling-room", "marker_images": [{"image": "marker-duel", "x": 0, "y": 14}]}],
	"resources": [
		{"resource": "Credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "oc", "image": "obstacle-course", "name": "Obstacle Course", "category": "Interactive", "prereq": null, "capacity": -10, "energy": -10, "maxnum": null, "floor": -24, "ceil": 24, "xp": 15000,
	"bounds": [
		{"x1": -84, "y1": -98, "x2": 84, "y2": 94, "floor": -24, "ceil": 24},
		{"x1": -8, "y1": 94, "x2": 8, "y2": 98, "floor": -24, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 98, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "obstacle-course", "marker_images": [{"image": "marker-obstacle", "x": 0, "y": 78}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Alloy Plate", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [400, 1200, 4000, 12000, 40000]},
		{"resource": "Rubedo", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}],
    "treetype": "oc-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "oa", "image": "obstacle-course-architect", "name": "Obstacle Course Architect", "category": "Interactive", "prereq": null, "capacity": 0, "energy": -2, "maxnum": 5, "floor": 0, "ceil": 48, "xp": 15000,
	"bounds": [
		{"x1": -76, "y1": -80, "x2": 76, "y2": 74, "floor": 0, "ceil": 48},
		{"x1": -6, "y1": 74, "x2": 6, "y2": 82, "floor": 0, "ceil": 48}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "obstacle-course-architect", "marker_images": [{"image": "marker-obstacle", "x": 0, "y": 72}]}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}], "unverified": true,
    "treetype": "os-1",
	"blockedFromAboveBy": [
		"ob","oc","re","ce"]}, //"b4"?

{"id": "ob", "image": "observatory", "name": "Observatory", "category": "Misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -32, "ceil": 52,
	"bounds": [
		{"x1": -50, "y1": -72, "x2": 50, "y2": 73, "floor": -32, "ceil": 52},
		{"x1": -6, "y1": 72, "x2": 6, "y2": 80, "floor": -32, "ceil": 52}],
	"doors": [
		{"x": 0, "y": 80, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}], "unverified": true,
    "treetype": "ob-1",
	"blockedFromAboveBy": [
		"lc","ce","ob","oc","lo","re"]}, //"b4"?
{"id": "gs", "image": "small-garden", "name": "Small Garden", "category": "Misc", "prereq": null, "capacity": -10, "energy": -6, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [550, 1650, 5500, 16500, 55000]},
		{"resource": "Nano Spores", "costs": [2000, 6000, 20000, 60000, 200000]},
		{"resource": "Forma", "costs": [1, 1, 1, 2, 8]}],
    "treetype": "32-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "gl", "image": "large-garden", "name": "Large Garden", "category": "Misc", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
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
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "Polymer Bundle", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "Nano Spores", "costs": [2500, 7500, 25000, 75000, 250000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "th", "image": "temple-of-honor", "name": "Temple Of Honor", "category": "Misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 20, "xp": 15000,
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
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "64-4",
	"blockedFromAboveBy": [
	    ]},
{"id": "os", "image": "open-space", "name": "Open Space", "category": "Misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -60, "ceil": 78,
	"bounds": [
		{"x1": -76, "y1": -80, "x2": 76, "y2": 74, "floor": -60, "ceil": 78},
		{"x1": -6, "y1": 74, "x2": 6, "y2": 82, "floor": -60, "ceil": 78}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": -1, "image": "open-space-other"},
		{"floor": 0, "image": "open-space"},
		{"floor": 1, "image": "open-space-other"}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true,
    "treetype": "os-1",
	"blockedFromAboveBy": [
	    ]},

{"id": "re", "image": "reactor", "name": "Reactor", "category": "Utility", "prereq": null, "capacity": -5, "energy": 25, "maxnum": null, "floor": -28, "ceil": 36,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": -28, "ceil": 36}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}],
    "treetype": "32-1",
	"blockedFromAboveBy": [
		"ob"]},
{"id": "b1", "image": "barracks", "name": "Barracks", "category": "Utility", "prereq": null, "capacity": -1, "energy": -1, "maxnum": 4, "floor": -8, "ceil": 12,
	"bounds": [
	    // todo: revisit the ceiling level on the barracks
		{"x1": -16, "y1": -18, "x2": 16, "y2": 18, "floor": -8, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 18, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 100000, 100000]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 15000, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 60000, 60000]},
		{"resource": "Rubedo", "costs": [300, 900, 3000, 30000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 25, 25]}], "unverified": true,
    "treetype": "32-1",
	"blockedFromAboveBy": [
	    ]},
{"id": "la", "image": "label", "name": "Label", "category": "Utility", "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": 0, "ceil": 0, "num": 0, "defaultLabel": "Label",
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20, "ignore": true}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1},
		{"x": -16, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [],
	"blockedFromAboveBy": []},

{"id": "oh1", "image": "old-hall", "name": "(Old) Clan Hall", "category": "Discontinued", "discontinued": true, "spawn": true, "prereq": null, "capacity": 100, "energy": 5, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -18, "y1": -32.25, "x2": 18, "y2": 32.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32.25, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "oh2", "image": "old-great-hall", "name": "(Old) Clan Great Hall", "category": "Discontinued", "discontinued": true, "spawn": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "64-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "occ", "image": "old-cross-connector", "name": "(Old) Cross Connector", "category": "Discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
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
{"id": "oct", "image": "old-t-connector", "name": "(Old) T-shaped Connector", "category": "Discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
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
{"id": "osh", "image": "old-straight-hallway", "name": "(Old) Straight Hallway", "category": "Discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 0, "maxnum": null, "floor": -8, "ceil": 24,
	"bounds": [
		{"x1": -6, "y1": -6.25, "x2": 6, "y2": 6.25, "floor": -8, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 6.25, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -6.25, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [], "unverified": true,
    "treetype": "16-2",
	"blockedFromAboveBy": [
	    ]},
{"id": "ore", "image": "old-reactor", "name": "(Old) Reactor", "category": "Discontinued", "discontinued": true, "prereq": null, "capacity": 0, "energy": 25, "maxnum": null, "floor": -8, "ceil": 24,
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
            // the extra door is the connection between the two halves
            return [
                "a-" + key[0] + key[1] + (key.substring(2,5) == "000" ? "0" : "1") + key[5],
                "b-" + key[3] + key[4] + ((key.substring(5) + key.substring(0,2)) == "000" ? "0" : "1") + key[2]
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

// spark point marker, just put it in the center of the room
// add 1 to the ze index so it appears above tree structure markers
var spawnMarkerMetadata = {"image": "marker-spawn", "x": 0, "y": 0, "z": 2};
