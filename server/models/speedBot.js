const bot = require('puppeteer');
const monitor = require('./monitor');
const Places = require('./table-gateway/places');
const bandwidth_usage = require('./table-gateway/bandwidth_usage');

const watchTableTime = 1000 * 10;

class SpeedBot {


  constructor(place_id) {
    this.place_id = place_id;
    this.pictures = [];
    this.pictureCount = 0;
    this.workingFine = true;
  }

  initialize() {
    const f = async () => {
      this.browser = await bot.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();
      this.place = (await Places.find({
        place_id: this.place_id,
      }))[0];
      this.deviceIp = this.place.ip;
      this.devicePort = this.place.webfix_port;
    };
    return f();
  }
  navigatePage() {
    const f = async () => {
      // const errMessage = 'something went wrong';
      await this.page.goto(`http://${this.deviceIp}:${this.devicePort}/webfig/#IP:Hotspot.Active`);
      await delay(5000);
      await this.page.focus('#name');
      await this.page.type('#name', process.env.MIKROTIK_API_USER);
      await this.page.focus('#password');
      await this.page.type('#password', process.env.MIKROTIK_API_PASSWORD);
      await this.page.keyboard.press('Enter');
      await this.page.waitFor('#id_CAPsMAN > span');
      await this.watchTable();
    };
    return f();
  }

  watchTable() {
    const f = async () => {
      const callback = async (msg) => {
        console.log(msg._text, 'console'); // eslint-disable-line
        if (msg._text === 'Failed to load resource: net::ERR_CONNECTION_TIMED_OUT') { // eslint-disable-line
          this.workingFine = false;
          console.log('Error esperado de consola');
          this.page.removeListener('console', callback);
        }
      };
      this.page.on('console', callback);
      while (this.workingFine) {
        await this.dealWithPictures();
        await delay(watchTableTime);
      }
      throw new Error('Session disconect');
    };
    return f();
  }

  dealWithPictures() {
    const f = async () => {
      const promises = [];
      promises.push(this.buildPicture(500));
      promises.push(this.buildPicture(1000));
      promises.push(this.buildPicture(1500));

      const response = await Promise.all(promises);
      if (!this.workingFine) {
        throw new Error('Session disconected');
      }
      await bandwidth_usage.mergeAndSavePictures(response, this.place_id);
      monitor.setStatusWorking(this.place_id, 'speed_user_monitor');
    };
    return f();
  }

  start() {
    return new Promise((resolve, reject) => {
      this.navigatePage().then((results) => {
        this.browser.close();
        resolve(results);
      }).catch((err) => {
        this.browser.close();
        reject(err);
      });
    });
  }

  buildPicture(delayTime) {
    const f = async () => {
      await delay(delayTime);
      const picture = {};
      const header = await this.page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('#content > table.table > thead > tr > th > span')); // eslint-disable-line
        return tds.map((td) => {
          return td.innerHTML;
        });
      });
      const positions = getPositionsFromHeader(header);
      const trCounts = await this.page.$$eval('#content > table.table > tbody > tr', (divs) => {
        return divs.length;
      });
      for (let i = 1; i <= trCounts; i++) {
        const data = await this.page.evaluate((j) => {
          const tds = Array.from(document.querySelectorAll(`#content > table.table > tbody:nth-child(${j + 1}) > tr > td`)); // eslint-disable-line
          return tds.map((td) => {
            return td.innerHTML;
          });
        }, i);
        const element = buildPictureElem(data, positions);
        picture[element.macAddress] = element;
      }
      return picture;
    };
    return f();
  }
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
    if (header[i] === 'User') {
      positions.user = i;
    }
    if (header[i] === 'Rx Rate') {
      positions.RxRate = i;
    }
    if (header[i] === 'Tx Rate') {
      positions.TxRate = i;
    }
  }
  return positions;
};


function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}


module.exports = SpeedBot;
