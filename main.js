function copyToClipboard(element) {
	navigator.clipboard.writeText(document.getElementById(element).value);
}

function addEntry(label, prefix, suffix) {
	return `\n${label}="${prefix}${document.getElementById(label).value}${suffix}"`
}

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

function dec2bin(dec) {
	return (dec >>> 0).toString(2);
}

function floatToGMLHex(number) {
	//for anyone reading this, i don't know what i'm doing!
	//if you have any recommendations for a better method, DM me at @GTcreyon on Twitter, or creyon#1828 on Discord :3

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
			if (fractional >= 1) { //grr not enough bits in javascript numbers so i have to use strings >:C
				mantissa += "1"
			} else {
				mantissa += "0"
			}
		}

		//basically we now have XXXX.YYY
		//we want 1.XXX * 2 ^ YYY, which means we need to introduce an exponent and shift the mantissa
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
		exponent += 1023 //account for bias, this is subtracted from when the value is processed in-engine
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
/*
[save]
varea="2F01000002000000000000000000000000000000000000000000000000001440"
objective="5.000000"
deaths="5.000000"
playerlvl="2.000000"
planetbits="2F0100001C00000000000000000000000000304000000000000000000000000000000000000000000000004000000000000000000000264000000000000000000000F03F000000000000000000003340000000000000000000003440000000000000000000003940000000000000000000001C40000000000000000000000840000000000000000000002040000000000000000000002C40000000000000000000003140000000000000000000003240000000000000000000003540000000000000000000003740000000000000000000003840000000000000000000002240000000000000000000002E40000000000000000000003640000000000000000000002A40000000000000000000001040000000000000000000003A40000000000000000000003B40000000000000000000002840000000000000000000002440000000000000000000001440000000000000000000001840"
inventory1="2F0100000600000000000000000000000000004000000000000000000000144000000000000000000000F03F000000000000000000000840000000000000000000001040000000000000000000001840"
inventory2="2F0100000500000000000000000000000000000000000000000000000000F03F000000000000000000000040000000000000000000000840000000000000000000001040"
event3="2F0100000300000000000000000000000000000000000000000000000000F03F000000000000000000000040"
event2="2F01000005000000000000000000000000002040000000000000000000002A40000000000000000000002440000000000000000000002840000000000000000000002640"
event1="2F0100000300000000000000000000000000000000000000000000000000004000000000000000000000F03F"
room="rm_bakery_1"
hp="5.000000"
money="55.000000"
-->
*/
