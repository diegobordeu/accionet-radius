function parseTime(time) {
  let response = '';
  if(time.hours) {
    response = response + time.hours + ':';
  }
  if(time.minutes) {
    if(time.minutes < 10) {
      response = response + '0' + time.minutes + ':';
    } else {
      response = response + time.minutes + ':';
    }
  }
  if(time.seconds) {
    if(time.second < 10){
      response = response + '0' + time.seconds;
    } else {
      response = response + time.seconds;
    }
  }
  if(!time.seconds && time.minutes) {
    response = response + '00';
  }
  if(!time.seconds && !time.minutes && time.hours) {
    response = response + '00:00';
  }
  console.log(response);
}
 const test =
   {
hours: 454,
minutes: 25,
seconds: 52
}

parseTime(test);
