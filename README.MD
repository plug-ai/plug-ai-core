<p align="center">
  <img src="public/logo.png" width="400" alt="PlugAI Logo" />
</p>

<p align="center">ChatGPT Plugin Core Package</p>

<p align="center">
<img src="https://img.shields.io/badge/version-0.0.1-blue" alt="Version" />
<img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
<img src="https://img.shields.io/badge/downloads-0-lightgreen" alt="Downloads" />
<img src="https://img.shields.io/badge/build-passing-green" alt="Build" />
<img src="https://img.shields.io/badge/coverage-0%25-red" alt="Coverage" />

</p>

## Description

In order to become an OpenAI plugin, an application needs to satisfy several conditions. For example, it needs to expose a plugin manifest file, document its own api and implement authentication flow. This package contains the logic that meets these requirements.

Specifically, it:
 - creates a manifest file out of configuration provided by client application (the application that uses the core package)  
 - exposes the manifest file under a route expected by ChatGPT
 - exposes the client application api documentation under a route expected by ChatGPT
 - contains logic for handling authentication types supported by ChatGPT (oauth, service_level, no-auth)
 - validates client application configuration
 - validates request params

## Example use

The core package can be used to transform any node-based api that supports catch-all-routes handling into an OpenAI Plugin. It is framework independent and uses Web API Request/Response for request handling. Here is an example of an app transformed into an OpenAI plugin: <a href="https://ai-plug-next-repo-link/" target="_blank">ai-plug-next</a>. This Next.js seed application can serve as a general reference on ``plug-ai-core`` usage or as a starting point for developing a Next.js-based OpenAI Plugin.

## Contribution

Contributions to this project are welcome! If you have ideas for improvements, bug fixes or new features, <a href="" target="_blank">feel free to join</a>. 

## Let's connect
- Email

## License

ai-plug-core package is licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" target="_blank">MIT License</a>