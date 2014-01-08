var config = exports;
if(process.env.GOOGLE_CLIENT_ID){
  require('./web.config').configure(config);
  config.isProduction = true;
  config.isProd = true;
}else{
  require('./test.config').configure(config); //this is not stored in git view example.config to setup your own
  config.isProduction = false;
  config.isProd = false;
}

