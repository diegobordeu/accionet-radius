# DOCUMENTATION
## Main monitoring features.
Cpu and free memory monitor:
 - check the cpu_usage and free flash memory on each network router that is regestred in the databse.
 - Connect to the router via Mikrotik api, take one data picture once each X millisecond and seva data to databse.
 - X milliseconds can be define in the monitor model on the apiWatchTime variable, after data is saved, connection is closed.
  ```javascript
const apiWatchTime = 1000 * 60 * 1;
```
User speed monitor.
 - Connect to each place network router via WebFix with Puppeteer browser bot.
 - Bot is watching the Ip>hotspot>active table on the WebFix Browser.
 - Once X milliseconds, Bot take 3 data pictures from the active users table and save to db the max values of tx rate and rx rate for each user.
  - X milliseconds can be define in the monitor model on the apiWatchTime variable.
  ```javascript
const tryAgainTime = 1000 * 60 * 5;
```
Session info registration.
 - Each time that any user log out any network, this feature save the session information (mac address, bytes in, bytes out session time and place id) on the database.
 - script on the log out section of mikrotik router OS is executed every time that any user log out and a server route is triggered
  > POST session/new/ ?(macAddress, bytesOut, bytesIn, placeId)

## Config file
 - mail.js:
```javascript
exports.sender_mail = sender_mail;
exports.mailArray = []; //  mails that will recive an alert every time that a network divece is desconected.
```

## API
Routes:
 > GET /api/session/find: ?(database table attributes, startDate, endDate).

 > GET /api/session/statistics/group-by/:param ?(startDate, endDate), param =('client' || 'place_id').

 > GET /api/router_stats/find  ?(database table attributes, startDate, endDate).
 - group the databse info by client or place id and gives the sum, average, max, min of variables bytes_in, bytes_out, session_time, (count of sessions and different sessions) or (count of different places visited for each client).
 > GET /api/router_stats/statistics/by-place/ ?(startDate, endDate, cpuDownLimit, cpuUpLimit)
 - group the databse info by place_id and gives the average, max, min of cpu_usage and free memory of each place_id. cpuDownLimit and CpuUpLimit define a range of cpu_usage values to search in database.
## Network devices
Routes:
 > GET /network_device/find/ ?(startDate, endDate, databse attribute)

 > POST /network_device/create/:place_id/:ip/:friendly_name

 > DELETE /network_device/delete/:place_id/:ip/

 > UPDATE /network_device/update/:place_id/:ip/ ?(database table new attributes)  

 > GET /network_device/group-by/ ?(startDate, endDate)
 - groups network devices by place_id.
 > POST /network_device/set-up-status/:place_id/:ip/:is_up('t' || 'f')  
 - to set up the working status of any network device, and send a email alert to notify, if it is need.This route should be triggered by the network router.
## Places
Routes
 > POST places/create/:place_id/:ip/:webfix_port/:api_port

 > DELETE places/delete/:place_id/:ip/

 > GET places/find/ ?(startDate, endDate, databse attribute)

 > POST places/update/:place_id/:ip ?(database table new attributes)  

## Sessions
Routes
 > POST session/new/ ?(macAddress, bytesOut, bytesIn, placeId)
 - This route should be triggered by the network router, when any user log out the network.

 ## Status
Route
 > GET /status/
 - show the main server monitoring features status (working status and reboots for each feature in each network place).
