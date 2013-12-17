var request = require('request');

describe('index route', function(){
  it('responds with a 200', function(done) {
    request('http://localhost:3001', function(error, response, body){
      expect(body).toContain('Click Here');
      done();
    });
  });
});