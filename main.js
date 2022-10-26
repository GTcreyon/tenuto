function copyToClipboard(element) {
	navigator.clipboard.writeText(document.getElementById(element).value);
}

function addEntry(label, prefix, suffix) {
	return `\n${label}="${prefix}${document.getElementById(label).value}${suffix}"`
}

// Run when generating the output file.
// Generates a string containing the save data, and stores it in the output field.
function generate() {
	let output = "[save]";
	output += "\nvarea=\"2F01000002000000000000000000000000000000000000000000000000001440\"";
	output += addEntry("objective", "", ".000000");
	output += addEntry("deaths", "", ".000000");
	output += addEntry("playerlvl", "", ".000000");
	output += generateDSList("planetbits");
	output += generateDSList("inventory1");
	output += generateDSList("inventory2");
	output += generateDSList("event1");
	output += generateDSList("event2");
	output += generateDSList("event3");
	output += addEntry("room", "rm_", "");
	output += addEntry("hp", "", ".000000");
	output += addEntry("money", "", ".000000");
	document.getElementById("output").value = output;
}

// Generate and return a DS List containing data from child items of an element with the given ID.
function generateDSList(id) {
	let output = `\n${id}=\"2F01`;
	let items = document.getElementById(id).childNodes;
	let lengthString = items.length.toString(16).toUpperCase();
	output += "0".repeat(6 - lengthString.length) + lengthString + "000000";
	items.forEach(item => {
		output += floatToGMLHex(item.value);
	});
	output += "\""
	return output
}

// Converts from decimal value to a binary string.
function dec2bin(dec) {
	return (dec >>> 0).toString(2);
}

// Convert a float to hexadecimal format that GameMaker can read.
function floatToGMLHex(number) {
	if (number == 0)
	{
		return "0".repeat(24)
	} else {
		let sign = Math.sign(number)
		let integral = Math.floor(number * sign)
		
		let fractional = number
		let mantissa = ""
		for (let i = 0; i < 52; i++) {
			fractional %= 1
			fractional *= 2
			if (fractional >= 1) { // Javascript integers don't have enough bits to be used with bitwise operators, so we use strings instead.
				mantissa += "1"
			} else {
				mantissa += "0"
			}
		}

		// We now have XXXX.YYY
		// We want 1.XXX * 2 ^ YYY, which means we need to introduce an exponent and shift the mantissa.
		let exponent = 0
		if (integral >= 2) {
			let integralString = dec2bin(integral).substring(1)
			exponent = Math.log2(integral)
			mantissa = integralString + mantissa
			mantissa = mantissa.substring(0, 51)
		} else if (integral < 1) {
			while (mantissa[0] == "0") {
				mantissa = mantissa.substring(1) + "0"
				exponent -= 1
			}
			mantissa = mantissa.substring(1) + "0"
			mantissa = mantissa.substring(1) + "0"
			exponent -= 1
			mantissa = dec2bin(integral % 1) + mantissa
		}
		exponent += 1023 // Account for bias - this is subtracted from when the value is processed in-engine.
		let exponentString = dec2bin(exponent)
		while (exponentString.length < 11)
		{
			exponentString = "0" + exponentString
		}
		let signString = "0"
		if (sign == -1) {
			signString = "1"
		}
		let fullValue = `${signString}${exponentString}${mantissa}`
		let hexValue = parseInt(reverseEntry(fullValue), 2).toString(16).toUpperCase()
		return "0".repeat(24 - hexValue.length) + hexValue
	}
}

function reverseEntry(input) {
	let revString = ""
	for (let i = 0; i < input.length / 8; i++) {
		revString = input.substring(i * 8, i * 8 + 8) + revString;
	}
	return revString
}

function addListItem(list) {
	const data = {
		"planetbits": [
			"The first one!",
			"To the right of the first one!",
			"Under the first one?",
			"Top of the World!",
			"Dumpling King Defeated",
			"Explosive Shortcut",
			"Even More Explosive Shortcu",
			"Locked Inside",
			"Elevator Maintenance",
			"WELCOME TO VIRTUAL WORLD",
			"Virtua Swinger",
			"Shortcut?",
			"Dark Shortcut",
			"*Record Scratch* *Freeze Frame*",
			"Mad Rocket Dash!",
			"Soda Addiction",
			"Licking Secret",
			"Mad Rocket Tower!",
			"Bakery Voyager",
			"Upper Crust",
			"Upper Crust - Water Switch",
			"Oops, I'm Offscreen",
			"Bakery Race Champion",
			"Planet Bit Switch 1",
			"Runaway Planet Bit",
			"Weird Backroom",
			"Rocket Launcher Maze",
			"Rocket Launcher Bonus",
		],
		"event1": [
			"???",
			"Virtual World Switch",
			"Room 4 Switch",
		],
		"event2": [
			"Encountered Tokki (Old)",
			"Won Race",
			"Started Race",
			"???",
			"???",
			"???",
			"???",
			"???",
			"???",
			"Encountered Tokki",
			"Encountered Soda Cat",
			"???",
			"Encountered Dumpling Dude",
			"Encountered Phil",
		],
		"event3": [
			"Encountered Dumpling King",
			"Completed Dumpling King Phase 1",
			"Defeated Dumpling King",
		],
		"inventory1": ["Default", "Oldbato", "Peabato", "Bottle", "EN-EF-TEE", "Metal", "VR"],
		"inventory2": ["Tongue", "Sword", "Rocket Launcher", "Camera", "Crowbar"],
	};
	let newSelect = document.createElement("select");
	
	for (let i = 0; i < data[list].length; i++) {
		let newOption = document.createElement("option");
		newOption.textContent = data[list][i];
		newOption.value = i;
		newSelect.appendChild(newOption);
	}
	document.getElementById(list).appendChild(newSelect);
}
