(function() {
  var path, server, servers, spawn;

  spawn = require("child_process").spawn;

  path = require("path");

  servers = {};

  server = {};

  server.launch = function(appMagic, serverScript, port, connect, timeout, exitCb) {
    var completed, connected, endpoint, serverProc, started, testPort;
    if (servers[port]) return servers[port];
    if (typeof timeout === 'function') {
      exitCb = timeout;
      timeout = null;
    }
    testPort = parseInt(port || 4001);
    endpoint = "http://localhost:" + testPort + "/";
    started = false;
    connected = false;
    completed = false;
    serverProc = spawn("node", [serverScript, '-p', testPort], {
      cwd: appMagic.appRoot(),
      env: appMagic.appEnv(),
      setsid: false
    });
    if (connect) {
      serverProc.stderr.on('data', function(data) {
        started = true;
        if (!connected) return connected = connect();
      });
    }
    serverProc.on('exit', function(code) {
      completed = true;
      return typeof exitCb === "function" ? exitCb(code) : void 0;
    });
    serverProc.timeOut = setTimeout(function() {
      if (started) return server.kill(testPort);
    }, timeout || 5000);
    servers[port] = serverProc;
    return server;
  };

  server.kill = function(port) {
    if (servers[port]) {
      clearTimeout(servers[port].timeOut);
      servers[port].kill('SIGTERM');
      return delete servers[port];
    }
  };

  server.running = function(port) {
    return servers[port] != null;
  };

  server.stopped = function(port) {
    return !server.running(port);
  };

  module.exports.server = server;

}).call(this);