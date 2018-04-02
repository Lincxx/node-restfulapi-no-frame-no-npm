/*
 * Create and export configuration variables
 */
 
 //Container for all the environments
 var environments = {};

 // Staging (default) environment

environments.staging = {
   'port' : 3000,
   'envName' : 'staging'
};

//Production environments
environments.production = {
    'port' : 5000,
    'envName' : 'production'
};


//Deteimine which env should be exported
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


//Export the module
module.exports = environmentToExport;