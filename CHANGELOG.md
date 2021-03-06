# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic
Versioning](http://semver.org/).

## 0.8.1
### Changed
- when constructing the url for iframed oauth, pass the port with the `parent` param, as Firefox now requires an exact match including port on the `X-Frame-Options` header

## 0.8.0

### Added
- ability to change remoteServiceName at runtime

## 0.7.0
## Added
- isLevelOne and isLevelTwo CPs to session

## Fixed
- null reference error because this was undefined

## Changed
- arcgis-oauth-bearer handles options differently - we now do not `set` the options on the bearer
- arcgis-oath-bearer now handles additional queryString params: autoAccountCreateForSocial & socialLoginProviderName

## [0.6.0]
### Added
- `isAdmin()` which will returnt true if `role === 'org_admin' && !roleId` - which is how we know if a user is a FULL org admin
-

## [0.5.0]
### Added
- configuration option to loadGroups during sign-in process. This makes an additional xhr to `/community/users/{username}` which returns the users groups.
- added `isGroupMember` to the gatekeeper which is exposed as `session.isGroupMember(groupId)` in consuming applications

## [0.4.3]
### Fixed
- typo in gatekeeper.js

## [0.4.2]
### Changed
- fix error in portalHostname (it used `portalHostName` instead of `portalHostname` from portal.self)
- deprecate `portalHostName` in favor of `portalHostname`

## [0.4.1]
### Changed
- removed all use of `ENV.APP.portalBaseUrl` in favor of `ENV.torii.providers['arcgis-oauth-bearer'].portalUrl`

## [0.4.0]
#### Added
- support for `ENV.rootURL` while still using `ENV.baseURL` if that is set
- portalHostName returns protocol-less hostname for Authenticated and Unauthenticated sessions.
#### Changed
- orgPortalUrl marked as deprecated

### Changed
- now using a fork of torii master that is ~0.8+


## [0.3.0]
#### Added
- orgPortalUrl CP on session service mixin

### Changed
- upgrade to ember 2.8

## [0.2.5]
#### Added
- option to configure a `customRedirectUri` in the `torii:{...}` config section, allowing greater flexibility with where the oAuth redirect page lives.
- bumped to node 6.3.0 in `.nvmrc` and `.travis.yml`

## [0.2.4]
#### Changed
- `redirect_uri` now respects `ENV.baseURL` if set

#### Added
- gh-pages deploy

## [0.2.3]
#### Changed
- removed gratuitous logging

## [0.2.2]
### Changed
-  the provider finds a cookie with a token, and makes the portals/self call but gets a 200 response that contains an error payload, reject the promise so that the app does not *think* the user is logged in.

## [0.2.1]
- withdrawn

## [0.2.0]
### Added
- option to redirect to static page for *much* faster iframe auth flows

## [0.1.2]
### Changed
- fixed typo in some logic in the dummy

## [0.1.1]
### Added
- gatekeeper service
- gatekeeper route + template
- fixed .nvmrc typo

## [0.0.3]
### Changed
- minor updates to readme and package.json

## [0.0.2]
### Added
- Example app can sign out when using Application auth

## [0.0.1]
### Added
- support for iframe (\*.argis.com only apps) oAuth
- support for application (pop-up) oAuth
