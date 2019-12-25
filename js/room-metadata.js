var roomMetadata =
{"general": {"floor_distance": 64 },
"rooms": [
{"id": "du", "image": "dueling-room", "name": "Dueling Room", "category": "Interactive", "prereq": null, "capacity": -10, "energy": -10, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 20}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [750, 2250, 7500, 22500, 75000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}]},
{"id": "or", "image": "oracle2", "name": "Oracle", "category": "Labs", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -8, "ceil": 12,
	"bounds": [
		{"x1": -14, "y1": -15, "x2": 14, "y2": 15, "floor": -8, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 15, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}]},
{"id": "le", "image": "energy-lab", "name": "Energy Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 16,
	"bounds": [
		{"x1": -14, "y1": -14, "x2": 14, "y2": 14, "floor": 0, "ceil": 16}],
	"doors": [
		{"x": 0, "y": 14, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}]},
{"id": "lc", "image": "chem-lab", "name": "Chem Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": -12, "ceil": 16,
	"bounds": [
		{"x1": -14, "y1": -16, "x2": 14, "y2": 16, "floor": -12, "ceil": 16}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}]},
{"id": "lb", "image": "bio-lab", "name": "Bio Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 12,
	"bounds": [
		{"x1": -14, "y1": -14, "x2": 14, "y2": 14, "floor": 0, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 14, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}]},
{"id": "lo", "image": "orokin-lab", "name": "Orokin Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -16, "y1": -26, "x2": 16, "y2": 26, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 26, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 20]}]},
{"id": "lt", "image": "tenno2-lab", "name": "Tenno Lab", "category": "Labs", "prereq": "or", "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -10, "y1": -9, "x2": 10, "y2": 9, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 9, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Polymer Bundle", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}]},
{"id": "oc", "image": "obstacle-course", "name": "Obstacle Course", "category": "Interactive", "prereq": null, "capacity": -10, "energy": -10, "maxnum": null, "floor": -38, "ceil": 24,
	"bounds": [
		{"x1": -84, "y1": -98, "x2": 84, "y2": 94, "floor": -38, "ceil": 24},
		{"x1": -8, "y1": 94, "x2": 8, "y2": 98, "floor": -38, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 98, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Alloy Plate", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [400, 1200, 4000, 12000, 40000]},
		{"resource": "Rubedo", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}]},
{"id": "oa", "image": "obstacle-course-architect", "name": "Obstacle Course Architect", "category": "Interactive", "prereq": null, "capacity": 0, "energy": -2, "maxnum": 3, "floor": 0, "ceil": 48,
	"bounds": [
		{"x1": -78, "y1": -82, "x2": 78, "y2": 74, "floor": 0, "ceil": 48},
		{"x1": -6, "y1": 74, "x2": 6, "y2": 82, "floor": 0, "ceil": 48}],
	"doors": [
		{"x": 0, "y": 82, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}], "unverified": true},
{"id": "cc", "image": "cross-connector", "name": "Cross Connector", "category": "Connectors", "prereq": null, "capacity": -10, "energy": -3, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -16, "y1": -8, "x2": 16, "y2": 8, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -16, "x2": 8, "y2": 16, "floor": 0, "ceil": 8}],
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
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "cb", "image": "elbow-connector", "name": "Elbow Connector", "category": "Connectors", "prereq": null, "capacity": -1, "energy": -1, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -4, "y1": -4, "x2": 16, "y2": 8, "floor": 0, "ceil": 8},
		{"x1": -4, "y1": -4, "x2": 8, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "cs", "image": "straight-hallway", "name": "Straight Hallway", "category": "Connectors", "prereq": null, "capacity": -1, "energy": -1, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -8, "y1": -8, "x2": 8, "y2": 8, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 8, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -8, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "cx", "image": "extended-straight-hallway", "name": "Extended Straight Hallway", "category": "Connectors", "prereq": null, "capacity": -2, "energy": -2, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -8, "y1": -16, "x2": 8, "y2": 16, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "ct", "image": "t-shaped-connector", "name": "T-shaped Connector", "category": "Connectors", "prereq": null, "capacity": -5, "energy": -2, "maxnum": null, "floor": 0, "ceil": 8,
	"bounds": [
		{"x1": -8, "y1": -16, "x2": 8, "y2": 16, "floor": 0, "ceil": 8},
		{"x1": -8, "y1": -8, "x2": 16, "y2": 8, "floor": 0, "ceil": 8}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1},
		{"x": 16, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -16, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "ce", "image": "elevator-bottom", "name": "Elevator", "category": "Connectors", "prereq": null, "capacity": -2, "energy": -2, "maxnum": null, "floor": -24, "ceil": 16,
	"bounds": [
		{"x1": -8, "y1": -12, "x2": 8, "y2": 12, "floor": -24, "ceil": 80}],
	"doors": [
		{"x": 0, "y": 12, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": 12, "floor": 1, "outx": 0, "outy": 1}],
	"floor_images": [
		{"floor": 0, "image": "elevator-bottom", "icon": "elevator-bottom-icon"},
		{"floor": 1, "image": "elevator-top", "icon": "elevator-top-icon"}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Ferrite", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Nano Spores", "costs": [1200, 3600, 12000, 36000, 120000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "re", "image": "reactor", "name": "Reactor", "category": "Utility", "prereq": null, "capacity": -5, "energy": 25, "maxnum": null, "floor": -32, "ceil": 26,
	"bounds": [
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": -32, "ceil": 26}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Salvage", "costs": [650, 1950, 6500, 19500, 65000]},
		{"resource": "Circuits", "costs": [350, 1050, 3500, 10500, 35000]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Forma", "costs": [1, 1, 1, 1, 5]}]},
{"id": "b1", "image": "barracks", "name": "Barracks", "category": "Utility", "prereq": null, "capacity": -1, "energy": -1, "maxnum": 4, "floor": -8, "ceil": 12,
	"bounds": [
		{"x1": -16, "y1": -18, "x2": 16, "y2": 18, "floor": -8, "ceil": 12}],
	"doors": [
		{"x": 0, "y": 18, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 100000, 0]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 15000, 0]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 60000, 0]},
		{"resource": "Rubedo", "costs": [300, 900, 3000, 30000, 0]},
		{"resource": "Forma", "costs": [1, 1, 3, 25, 0]}], "unverified": true},
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
		{"resource": "Forma", "costs": [1, 1, 1, 2, 8]}]},
{"id": "gl", "image": "large-garden", "name": "Large Garden", "category": "Misc", "prereq": null, "capacity": -15, "energy": -8, "maxnum": null, "floor": 0, "ceil": 20,
	"bounds": [
		{"x1": -32, "y1": -8, "x2": 32, "y2": 8, "floor": 0, "ceil": 20},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 20},
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
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true},
{"id": "ob", "image": "observatory", "name": "Observatory", "category": "Misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": -40, "ceil": 56,
	"bounds": [
		{"x1": -50, "y1": -80, "x2": 50, "y2": 80, "floor": -40, "ceil": 56}],
	"doors": [
		{"x": 0, "y": 80, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Ferrite", "costs": [800, 2400, 8000, 24000, 80000]},
		{"resource": "Circuits", "costs": [200, 600, 2000, 6000, 20000]},
		{"resource": "Salvage", "costs": [500, 1500, 5000, 15000, 50000]},
		{"resource": "Forma", "costs": [1, 1, 2, 5, 15]}], "unverified": true},
{"id": "th", "image": "temple-of-honor", "name": "Temple Of Honor", "category": "Misc", "prereq": null, "capacity": -2, "energy": -5, "maxnum": null, "floor": 0, "ceil": 24,
	"bounds": [
		{"x1": -32, "y1": -8, "x2": 32, "y2": 8, "floor": 0, "ceil": 24},
		{"x1": -8, "y1": -32, "x2": 8, "y2": 32, "floor": 0, "ceil": 24},
		{"x1": -16, "y1": -16, "x2": 16, "y2": 16, "floor": 0, "ceil": 24}],
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
		{"resource": "Forma", "costs": [1, 1, 1, 3, 10]}], "unverified": true},
{"id": "h1", "image": "clan-hall", "name": "Clan Hall", "category": "Halls", "prereq": null, "capacity": 100, "energy": 5, "maxnum": 1, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -18, "y1": -32, "x2": 18, "y2": 32, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": []},
{"id": "h2", "image": "clan-great-hall", "name": "Clan Great Hall", "category": "Halls", "prereq": "h1", "capacity": 200, "energy": -2, "maxnum": 1, "floor": -12, "ceil": 24,
	"bounds": [
		{"x1": -18, "y1": -32, "x2": 18, "y2": 32, "floor": -12, "ceil": 24}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Salvage", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Nano Spores", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]},
{"id": "h3", "image": "clan-greater-hall", "name": "Clan Greater Hall", "category": "Halls", "prereq": "h2", "capacity": 200, "energy": -2, "maxnum": 1, "floor": -12, "ceil": 24,
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
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]},
{"id": "h4", "image": "clan-grand-hall", "name": "Clan Grand Hall", "category": "Halls", "prereq": "h3", "capacity": 200, "energy": -2, "maxnum": 1, "floor": -12, "ceil": 32,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 32}],
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
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]},
{"id": "h5", "image": "clan-grandest-hall", "name": "Clan Grandest Hall", "category": "Halls", "prereq": "h4", "capacity": 200, "energy": -2, "maxnum": 1, "floor": -12, "ceil": 32,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 32}],
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
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]},
{"id": "hi", "image": "inspiration-hall", "name": "Inspiration Hall", "category": "Halls", "prereq": null, "capacity": 100, "energy": -1, "maxnum": 3, "floor": -12, "ceil": 48,
	"bounds": [
		{"x1": -32, "y1": -32, "x2": 32, "y2": 32, "floor": -12, "ceil": 48}],
	"doors": [
		{"x": 0, "y": 32, "floor": 0, "outx": 0, "outy": 1},
		{"x": 32, "y": 16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 32, "y": -16, "floor": 0, "outx": 1, "outy": 0},
		{"x": 0, "y": -32, "floor": 0, "outx": 0, "outy": -1},
		{"x": -32, "y": -16, "floor": 0, "outx": -1, "outy": 0},
		{"x": -32, "y": 16, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [1000, 3000, 10000, 30000, 100000]},
		{"resource": "Alloy Plate", "costs": [150, 450, 1500, 4500, 15000]},
		{"resource": "Ferrite", "costs": [600, 1800, 6000, 18000, 60000]},
		{"resource": "Rubedo", "costs": [300, 900, 3000, 9000, 30000]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]},
{"id": "dd", "image": "dry-dock", "name": "Dry Dock", "category": "Interactive", "prereq": null, "capacity": -20, "energy": -6, "maxnum": 1, "floor": -80, "ceil": 200,
	"bounds": [
		{"x1": -128, "y1":  -128, "x2": 128, "y2":  128, "floor": -80, "ceil": 200},
		{"x1": -128, "y1": -1272, "x2": 128, "y2":  -96, "floor": -200, "ceil": 200, "invis": "true"}],
	"doors": [
		{"x": 0, "y": 128, "floor": 0, "outx": 0, "outy": 1},
		{"x": 128, "y": 0, "floor": 0, "outx": 1, "outy": 0},
		{"x": -128, "y": 0, "floor": 0, "outx": -1, "outy": 0}],
	"resources": [
		{"resource": "Credits", "costs": [100000, 300000, 1000000, 3000000, 10000000]},
		{"resource": "Salvage", "costs": [25000, 75000, 250000, 750000, 2500000]},
		{"resource": "Circuits", "costs": [850, 2550, 8500, 25500, 85000]},
		{"resource": "Tellurium", "costs": [15, 45, 150, 450, 1500]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]},
{"id": "cr", "image": "crimson-branch", "name": "Crimson Branch", "category": "Interactive", "prereq": null, "capacity": -2, "energy": -4, "maxnum": null, "floor": 0, "ceil": 30,
	"bounds": [
		{"x1": -32, "y1":  8, "x2": 32, "y2": -30, "floor": 0, "ceil": 30},
		{"x1": -24, "y1": 16, "x2": 24, "y2": -30, "floor": 0, "ceil": 30}],
	"doors": [
		{"x": 0, "y": 16, "floor": 0, "outx": 0, "outy": 1}],
	"resources": [
		{"resource": "Credits", "costs": [100000, 300000, 1000000, 3000000, 10000000]},
		{"resource": "Hexenon", "costs": [250, 750, 2500, 7500, 25000]},
		{"resource": "Alloy Plate", "costs": [8500, 25500, 85000, 255000, 850000]},
		{"resource": "Orokin Cell", "costs": [25, 75, 250, 750, 2500]},
		{"resource": "Forma", "costs": [1, 1, 3, 8, 25]}]}
]};