requestData = {
  url: host().oasis("sendNotification"),
  params: {
    uri: {
      "_soTT": context.variables.sott,
      "_template": context.variables.notificationType,
      "_comments": context.variables.comments,
      "_userEmail": context.variables.user
    },
    body: {}
  },
  testData: {
    uri: {
      "_soTT": "1234",
      "_template": "enroute",
      "_comments": "testing 1234",
      "_userEmail": "lportin@gta.net"
    },
    body: {}
  }
}

var notification_sent = await (request.post(requestData));