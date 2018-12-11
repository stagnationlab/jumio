# Jumio

[![Downloads](https://img.shields.io/npm/dm/jumio.svg)](http://npm-stat.com/charts.html?package=jumio)
[![Version](https://img.shields.io/npm/v/jumio.svg)](http://npm.im/jumio)
[![License](https://img.shields.io/npm/l/jumio.svg)](http://opensource.org/licenses/MIT)

**Jumio NetVerify identity and document verification library.**

Provides properly typed interface for communicating with the Jumio identity and document verification services.

- Works with express server.
- Provides middleware for handling Jumio callbacks.
- Works with both US and EU data-centers.
- Parses the callback including JSON payloads to a more usable format.
- Performs callback IP validation.
- Written in TypeScript, no need for extra typings.

## Installation

This package is distributed via npm

```cmd
npm install jumio
```
```cmd
yarn add jumio
```

## Commands

- `yarn build` to build the production version.
- `yarn lint` to lint the codebase.
- `yarn prettier` to run prettier.