curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"postback",
      "title":"Help",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
    },
    {
      "type":"postback",
      "title":"Start a New Order",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAaESlxupHABAKNeug0emBBRINgk2KjSQn66E7lZBPSKZC8ZBdT7epGgk5Su7qI9ulj21s1QZCxig1LLsMauoeAbOuSVXgtpUulp3IZCIYlfRyniVYcmQAd2qZCfCAAMIlGVtTzIjNiNuPZAYazLyDZAlrrXxvOZBTifM0u79nECHWgZDZD"
