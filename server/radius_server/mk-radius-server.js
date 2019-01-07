const radius = require('./lib/radius');
const dgram = require('dgram');
const Subscription = require('../models/table-gateway/subscription');

const secret = process.env.RADIUS_SECRET;
const server = dgram.createSocket('udp4');
let testRecord = [];
let sendedPackets = [];


const start = () => {
  server.bind(1812);
};


server.on('message', (msg, rinfo) => {
  processPacket(msg, rinfo).then(() => {
    // console.log('succes');
  }).catch((err) => {
    if (process.env.NODE_ENV === 'test') {
      testRecord.push(err);
    }
    // console.log(err);
  });
});

const processPacket = async (msg, rinfo) => {
  const packet = await readPacket(msg, secret);
  const username = packet.attributes['User-Name'];
  // console.log(packet, 'dsadsa');

  if (packet.code === 'Access-Request') {
    const auth = await checkAuth(username);
    await sendAuth(auth, packet, rinfo);
    // console.log(`${packet.code} of user ${username}`);
  }
  if (packet.code === 'Accounting-Request') {
    await sendAccountingResponde(packet, rinfo);
    // console.log(`${packet.code} Acct-Status-Type: ${packet.attributes['Acct-Status-Type']}user: ${username}`);
  }
};

server.on('listening', () => {
  // const address = server.address();
  // console.log(`radius server listening ${address.address}:${address.port}`);
});

function readPacket(msg, secret) {
  return new Promise((resolve, reject) => {
    const packet = radius.decode({
      packet: msg,
      secret,
    });
    return packet ? resolve(packet) : reject('auth error');
  });
}

const checkAuth = (client) => {
  return new Promise((resolve, reject) => {
    Subscription.table().where('expire_date', '>', new Date()).andWhere({ mac_address: client }).then((results) => {
      return results[0] ? resolve(true) : resolve(false);
    })
    .catch((err) => {
      reject(err);
    });
  });
};

function sendAuth(auth, packet, rinfo) {
  return new Promise((resolve, reject) => {
    const response = radius.encode_response(buildResponse(auth, packet));
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (process.env.NODE_ENV === 'test' && !err) {
        sendedPackets.push(packet);
      }
      return err ? reject(`Error sending response to ${rinfo}`) : resolve();
    });
  });
}

function buildResponse(auth, packet) {
  return auth ? {
    packet,
    code: 'Access-Accept',
    secret,
  } : {
    packet,
    code: 'Access-Reject',
    secret,
  };
}

function sendAccountingResponde(packet, rinfo) {
  return new Promise((resolve, reject) => {
    const response = radius.encode_response({
      packet,
      code: 'Accounting-Response',
      secret,
    });
    server.send(response, 0, response.length, rinfo.port, rinfo.address, (err) => {
      if (process.env.NODE_ENV === 'test' && !err) {
        sendedPackets.push(packet);
      }
      return err ? reject(`Error sending response to ${rinfo}`) : resolve();
    });
  });
}

module.exports = {
  start,
  showRecord: () => {
    return testRecord;
  },
  showSendendPacket: () => {
    return sendedPackets;
  },
  reSetRecord: () => {
    testRecord = [];
  },
  reSetSendedPacket: () => {
    sendedPackets = [];
  },
  checkAuth,
  close: () => {
    server.close();
  },
};
