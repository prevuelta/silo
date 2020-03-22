## Silo CMS

A lightweight file base CMS

- Stores data as json files
- Uses sqlite3 for storing users
- Schema written with in JSON schema

### Getting started

`npm install silo-cli -g`

Navigate to site folder and create site with:

`silo init`

To run dev version of site with watchers:

`silo dev`


### Site structure

```
/
├── assets
├── data
  └── [datafile].json
├── dist
├── schema
  └── [schema].json
├── src
  ├── scripts
  ├── views
    ├── .pug templates
  └── styles
└── package.json
```
