requestData = {
  url: host().arcgis("openMapForSOClear"),
  params: {
    "_user": user.emailId,
    "_ip": device.location_info.ip
  },
  testData: {
    "_user": "lportin@gta.net",
    "_ip": "103.245.64.249"
  }
}
var openMap = await (request.get(requestData));