/**
 * arcgis-oauth.js
 *
 * torii provider that works with ArcGIS.com oauth
 */
 import Provider from 'torii/providers/oauth2-bearer';
 import {configurable} from 'torii/configuration';
 import QueryString from './query-string';
 import ENV from '../config/environment';
 import Ember from 'ember';

 var ArcGISOAuth = Provider.extend({
   name: 'arcgis-oauth-bearer',

   // Allow the portalUrl to be passed in, but default to ago
   portalUrl: configurable('portalUrl', 'https://www.arcgis.com'),

   path: '/sharing/oauth2/authorize',

   // construct the authorize end-point url based on the portalUrl
   baseUrl: configurable('baseUrl', function () {
     return `${this.get('portalUrl')}${this.get('path')}`;
   }),

   showSocialLogins: configurable('showSocialLogins', false),

   display: configurable('display', 'default'),

   expiration: configurable('expiration', 20160),

   locale: configurable('locale', 'en-us'),

   // These params must be present in on the provider
   requiredUrlParams: ['response_type', 'showSocialLogins', 'display', 'expiration', 'locale'],
   // additional params that this provider accepts
   optionalUrlParams: ['client', 'parent', 'autoAccountCreateForSocial', 'socialLoginProviderName'],
   // params the provider will extract from the redirected url
   responseParams: ['token', 'state', 'expires_in'],

   customRedirectUri: configurable('customRedirectUri', ''),

   _currentBaseUrl: function () {
     return [window.location.protocol, '//', window.location.host].join('');
   },

   buildQueryString: function(options){
     const requiredParams = this.get('requiredUrlParams');
     const optionalParams = this.get('optionalUrlParams');

     const qs = QueryString.create({
       provider: this,
       requiredParams: requiredParams,
       optionalParams: optionalParams,
       options
     });

     return qs.toString();
  },

  buildUrl: function(options){
    let base = this.get('baseUrl');
    if (options.portalUrl || options.path) {
      base = options.portalUrl || this.get('portalUrl');
      const path = options.path || this.get('path');
      base = `${base}${path}`;
    }
    delete options.portalUrl;
    delete options.path;

    const qs = this.buildQueryString(options);

    return [base, qs].join('?');
  },

   /**
    * shows the pop-up/iframe - we override the base implementation so
    * we can merge the passed in options into the object before we show
    * the login
    */
   open: function (options) {
     options = options || {};

     if (options.remoteServiceName) {
       // torii uses this to determine whether a popout or an iframe is used
       // we need to be able to pass this option in at runtime
       this.set('configuredRemoteServiceName', options.remoteServiceName);
       delete options.remoteServiceName;
     }

     const display = options.display || this.get('display');
     if (display === 'iframe') {
       // the display parameter is sent on the url querystring
       // if we are using an iframe, we need to set the parent to the current domain
       options.parent = this._currentBaseUrl(); // window.location.protocol + '//' + window.location.hostname;
     }

     let uri = '';
     // Check for a customized redirect uri. This can be useful if your app
     // is hosted by rails or some other server-side rendering system, or
     // if you have multiple apps fronted by nginx and you want to centralize
     // the redirects.
     if (this.get('customRedirectUri')) {
       uri = this.get('customRedirectUri');
     } else {
       // Set the redirectUri to the redirect.html that's in the addon's public
       // folder and exposed at /<addon-name>/redirect.html
       // By default torii redirects to the whole ember app, which can be really slow
       // given that it's just 10 lines of js that's needed
       if (ENV.baseURL || ENV.rootURL) {
         let path = ENV.baseURL || ENV.rootURL;
         uri = this._currentBaseUrl() + path + 'torii-provider-arcgis/redirect.html';
       } else {
         uri = this._currentBaseUrl() + '/' + 'torii-provider-arcgis/redirect.html';
       }
     }

     this.set('redirectUri', uri);

     let name = this.get('name');
     let url = this.buildUrl(options);
     let redirectUri = this.get('redirectUri');
     let responseParams = this.get('responseParams');

     return this.get('popup').open(url, responseParams, options)
      .then(function (authData) {
        var missingResponseParams = [];

        responseParams.forEach(function (param) {
          if (authData[param] === undefined) {
            missingResponseParams.push(param);
          }
        });

        if (missingResponseParams.length) {
          throw new Error('The response from the provider is missing ' +
                 'these required response params: ' + missingResponseParams.join(', '));
        }
        Ember.debug('session.open is returning with data...');
        return {
          authorizationToken: authData,
          provider: name,
          redirectUri: redirectUri
        };
      });
   }

 });

 export default ArcGISOAuth;
