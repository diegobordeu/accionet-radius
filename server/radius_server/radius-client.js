const Radius = require('./lib/radius');
const dgram = require('dgram');

const client = dgram.createSocket('udp4');
const sent_packets = {};


const secret = process.env.RADIUS_SECRET;
const start = () => {
  client.bind(49001);


  client.on('message', (msg) => {
    const response = Radius.decode({
      packet: msg,
    });
    const request = sent_packets[response.identifier];
    const valid_response = Radius.verify_response({
      response: msg,
      request: request.raw_packet,
      secret: request.secret,
    });
        // client.close();
    // console.log(valid_response);
  });
};

const sendPackage = (packet) => {
  const encoded = Radius.encode(packet);
  client.send(encoded, 0, encoded.length, 1812, 'localhost');
  sent_packets[packet.identifier] = {
    raw_packet: encoded,
    secret: packet.secret,
  };
};

const mkPackage = (username) => {
  return {
    code: 'Access-Request',
    secret,
    identifier: 0,
    attributes: [
      ['NAS-Port-Type', 'Wireless-802.11'],
      ['Calling-Station-Id', username],
      ['Called-Station-Id', 'hotspot1'],
      ['NAS-Port-Id', 'bridge1'],
      ['User-Name', username],
      ['NAS-Port', 2159018172],
      ['Framed-IP-Address', '10.5.0.252'],
      // ['Vendor-Specific', ['Mikrotik-Host-IP', '10.5.0.252']],
      ['Service-Type', 'Login-User'],
      ['NAS-Identifier', 'glamys'],
      ['NAS-IP-Address', '192.168.0.27'],
    ],
  };
};


// { 'NAS-Port-Type': 'Wireless-802.11',
//      'Calling-Station-Id': '9C:4F:DA:11:56:34',
//      'Called-Station-Id': 'hotspot1',
//      'NAS-Port-Id': 'bridge1',
//      'User-Name': '9C:4F:DA:11:56:34',
//      'NAS-Port': 2159018172,
//      'Acct-Session-Id': '80b000bc',
//      'Framed-IP-Address': '10.5.0.252',
//      'Vendor-Specific': { 'Mikrotik-Host-IP': '10.5.0.252' },
//      'CHAP-Challenge': <Buffer 9d 27 d8 0d 83 62 40 00 18 ae 69 1c fb 2d 99 c6>,
//      'CHAP-Password': <Buffer e9 df 3f 46 9e 0a b5 cf db b4 79 02 8d 1f c5 60 8e>,
//      'Service-Type': 'Login-User',
//      'NAS-Identifier': 'glamys',
//      'NAS-IP-Address': '192.168.0.27' },

const packet_accepted = {
  code: 'Access-Request',
  secret,
  identifier: 0,
  attributes: [
    ['NAS-IP-Address', '10.5.5.5'],
    ['User-Name', 'jlpicard'],
    ['User-Password', 'beverly123'],
  ],
};

const packet_rejected = {
  code: 'Access-Request',
  secret,
  identifier: 1,
  attributes: [
    ['NAS-IP-Address', '10.5.5.5'],
    ['User-Name', 'egarak'],
    ['User-Password', 'tailoredfit'],
  ],
};

const packet_wrong_secret = {
  code: 'Access-Request',
  secret: 'wrong_secret',
  identifier: 2,
  attributes: [
    ['NAS-IP-Address', '10.5.5.5'],
    ['User-Name', 'riker'],
    ['User-Password', 'Riker-Omega-3'],
  ],
};

// const client = dgram.createSocket('udp4');
//
// client.bind(49001);
//
//
//
//
// const sent_packets = {};
//
// [packet_accepted, packet_rejected, packet_wrong_secret].forEach((packet) => {
//   const encoded = Radius.encode(packet);
//   sent_packets[packet.identifier] = {
//     raw_packet: encoded,
//     secret: packet.secret,
//   };
//   client.send(encoded, 0, encoded.length, 1812, 'localhost');
// });

module.exports = {
  start,
  sendPackage,
  mkPackage,
  packet_accepted,
  packet_rejected,
  packet_wrong_secret,
  close: () => {
    client.close();
  },
};
