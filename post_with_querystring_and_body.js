requestData = {
  url: host().oasis("put4CompleteTT"),
  params: {
    uri: {
      "_userEmail": user.emailId
    },
    body: {
      "TTNum": context.variables.sott,
      "TTStatus": context.variables.ttStatus,
      "PlantClassCode": context.variables.plantClassCode,
      "FoundCode": context.variables.foundCode,
      "CauseCode": context.variables.causeCode,
      "ResolutionCode": context.variables.resolutionCode,
      "VerifiedBy": context.variables.verifiedBy,
      "Facilities": context.variables.facilities,
      "IntStat": context.variables.trainRates,
      "Comments": context.variables.comments
    }
  },
  testData: {
    uri: {
      "_userEmail": "lportin@gta.net"
    },
    body: {
      "TTNum": "1234",
      "TTStatus": "Test Status",
      "PlantClassCode": "Test PCC",
      "FoundCode": "Test FC",
      "CauseCode": "Test CC",
      "ResolutionCode": "Test RC",
      "VerifiedBy": "Test VB",
      "Facilities": `Test F
Test F123
Test F456`,
      "IntStat": `Test I
Test I123
Test I456`,
      "Comments": `Testing 123
Testing 1234566
Testing 5468735`
    }
  }
}
var ttCleared = await (request.put(requestData));