
  exports.group = function(groupName, ex, fun) {
    var t;
    t = function(name, test) {
      console.log("Prepping test: test " + name);
      return ex['test ' + name] = test;
    };
    console.log("Prepping group: " + groupName);
    return fun(t);
  };