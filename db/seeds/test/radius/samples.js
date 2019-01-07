module.exports = [{
  mac_address: 'AA:BB:CC:DD:00:11',
  profile_id: '1',
  expire_date: new Date((new Date()).getTime() + (24 * 1 * 3600 * 1000)),
}, {
  mac_address: 'AA:BB:CC:DD:00:22',
  profile_id: '1',
  expire_date: new Date((new Date()).getTime() - (5 * 60 * 1000)),
}, {
  mac_address: 'AA:BB:CC:DD:00:33',
  profile_id: '1',
  expire_date: new Date((new Date()).getTime() + (24 * 1 * 3600 * 1000)),
}];
