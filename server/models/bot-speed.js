const bandwidth_usage = require('./table-gateway/bandwidth_usage');
const Places = require('./table-gateway/places');
const bot = require('puppeteer');
const monitor = require('./monitor');


exports.speedUserMonitor = async (place_id) => {
  const browser = await bot.launch();
  const page = await browser.newPage();
  const deviceIp = await getDeviceIp(place_id);
  await navigatePage(page, browser, place_id, deviceIp).then((results) => {
    return new Promise((resolve) => {
      browser.close();
      resolve(results);
    });
  }).catch((err) => {
    return new Promise((resolve, reject) => {
      browser.close();
      reject(err);
    });
  });
};

//   await page.screenshot({ path: `example${place_id}.png` });
const navigatePage = async (page, browser, place_id, deviceIp) => {
  let workigFine = true;
  let errMessage = 'something went wrong';
  let pictures = [];
  let pictureCount = 0; // eslint-disable-line
  await page.goto(`http://${deviceIp}/webfig/#IP:Hotspot.Active`);
  await delay(2000);
  await page.focus('#name');
  await page.type('#name', process.env.MIKROTIK_API_USER);
  await page.focus('#password');
  await page.type('#password', process.env.MIKROTIK_API_PASSWORD);
  const button = await page.$('li a');
  await button.click();
  await page.waitFor('#id_CAPsMAN');
  const callback = async (msg) => {
    console.log(msg._text, 'console');
    if (msg._text === 'Failed to load resource: net::ERR_CONNECTION_TIMED_OUT') { // eslint-disable-line
      await browser.close();
      console.log('===');
    }
  };
  page.on('console', callback);

  while (workigFine) {
    takePicture(page, place_id, pictures, pictureCount).then(() => {
      pictures = [];
    }).catch((err) => {
      page.removeListener('console', callback);
      workigFine = false;
      errMessage = err;
    });
    await delay(500);
  }
  await reportProblem(errMessage);
};

function reportProblem(message) {
  return new Promise((resolve, reject) => {
    if (message !== '') {
      return reject(message);
    }
    return resolve();
  });
}

function getDeviceIp(place_id) {
  return new Promise((resolve, reject) => {
    Places.all().then((places) => {
      const deviceIp = getEspecificPlace(places, place_id).ip;
      resolve(deviceIp);
    }).catch((err) => {
      reject(err);
    });
  });
}

function getEspecificPlace(places, place_id) {
  for (let i = 0; i < places.length; i++) {
    if (places[i].place_id === place_id) {
      return places[i];
    }
  }
  return null;
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const buildPictureElem = (data, positions) => {
  const pictureElem = {};
  pictureElem.macAddress = data[positions.user];
  pictureElem.RxRate = data[positions.RxRate];
  pictureElem.TxRate = data[positions.TxRate];
  return pictureElem;
};

const getPositionsFromHeader = (header) => {
  const positions = {};
  for (let i = 0; i < header.length; i++) {
    if (header[i] === 'User') { positions.user = i; }
    if (header[i] === 'Rx Rate') { positions.RxRate = i; }
    if (header[i] === 'Tx Rate') { positions.TxRate = i; }
  }
  return positions;
};

const buildPicture = async (page) => {
  const picture = {};
  const header = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('#content > table.table > thead > tr > th > span')); // eslint-disable-line
    return tds.map((td) => { return td.innerHTML; });
  });
  const positions = getPositionsFromHeader(header);
  const trCounts = await page.$$eval('#content > table.table > tbody > tr', (divs) => { return divs.length; });
  for (let i = 1; i <= trCounts; i++) {
    const data = await page.evaluate((j) => {
      const tds = Array.from(document.querySelectorAll(`#content > table.table > tbody:nth-child(${j + 1}) > tr > td`)); // eslint-disable-line
      return tds.map((td) => { return td.innerHTML; });
    }, i);
    const element = buildPictureElem(data, positions);
    picture[element.macAddress] = element;
  }
  console.log(picture);
  return picture;
};

const takePicture = async (page, place_id, pictures, pictureCount) => {
  pictureCount++;
  console.log(pictureCount, 'place_id', place_id);
  if (pictureCount === 4) {
    pictureCount = 0;
    console.log('o');
    return 0;
  }
  pictures.push(await buildPicture(page));
  if (pictureCount === 3 || pictureCount > 3) {
    console.log(pictures, 'place_id ================>', place_id);
    await bandwidth_usage.mergeAndSavePictures(pictures, place_id);
    monitor.setStatusWorking(place_id, 'speed_user_monitor');
  }
};
