const macaddress = require('macaddress');

function collect(key, options) {
  let macAddress = ''
  try {
    macAddress = JSON.stringify(macaddress.networkInterfaces(), null, 2)
  } catch (err) {
    console.error('get mac address failed')
  }
  if (window.Tracker) {
    window.Tracker.click(key, {
      ...options,
      userMac: macAddress
    });
  } else {
    console.error("window.Tracker doesn't work");
  }
}

function init() {
  if (!window._to) {
    window._to = {
      server: 'https://cn-hangzhou-mas-log.cloud.alipay.com/loggw/webLog.do',
      appId: 'ONEX25F2353160135',
      workspaceId: 'default',
      h5version: '0.1.1.1',
    };
  } else {
    console.log('mPaas has inited already');
  }
}

function initTracker() {
  if (!window.Tracker) {
    if (window.initTracker && typeof window.initTracker === 'function') {
      window.initTracker();
    }
  }
}