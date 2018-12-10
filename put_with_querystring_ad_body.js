requestData = {
  url: host().omnia("put4ProvisionEquipment"),
  params: {
    uri: {
      "_soTT": context.variables.sott,
      "_userEmail": context.variables.userEmail
    },
    body: context.variables.equipments
  },
  testData: {
    uri: {
      "_soTT": "1234",
      "_userEmail": "lportin@gta.net"
    },
    body: [{
      "Action": "Add",
      "Model": "NL3112",
      "MAC": "0000000000AF",
      "SerialNumber": "IT TEST 1"
    }, {
      "Action": "Remove",
      "Model": "NL3120",
      "MAC": "0000000000DD",
      "SerialNumber": "IT TEST 2"
    }, {
      "Action": "Add",
      "Model": "ADBSTB",
      "MAC": "0000000000CC",
      "SerialNumber": "IT TEST 3"
    }, {
      "Action": "Remove",
      "Model": "ADBDVR",
      "MAC": "0000000000AA",
      "SerialNumber": "IT TEST 4"
    }]
  }
}

var provisionEquipment = await (request.put(requestData));