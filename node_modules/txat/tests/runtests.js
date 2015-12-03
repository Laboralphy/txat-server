// test de TxatSystem
var runner = require('qunit');


runner.options.log.assertions = false;
runner.options.log.tests = false;
runner.options.log.errors = true;
runner.options.log.summary = false;
runner.options.log.globalSummary = true;
runner.options.log.testing = false;


runner.run([{
    code : "../Recycler.js",
    tests : "RecyclerTest.js"
}, {
    code : "../AccessList.js",
    tests : "AccessListTest.js"
}, {
    code : "../Channel.js",
    tests : "ChannelTest.js"
}, {
    code : "../User.js",
    tests : "UserTest.js"
}, {
    code : "../index.js",
    tests : "TxatSystemTest.js"
}, {
	code : '../Plugins/FilterPlugin.js',
	tests : 'FilterTest.js'
}, {
	code : '../Powers.js',
	tests : 'PowersTest.js'
}]);
