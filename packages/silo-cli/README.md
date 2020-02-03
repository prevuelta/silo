# silo-cli [NOT FUNCTIONAL - WIP]

### Setting up
To create a new silo instance, run 
`silo init` in an empty folder.
A prompt will run you through setting up a site and creating an admin user
This will also populate the `.env` file with your settings.

`silo dev` will run a local version on the port you specified or default `8080`

### Api

```shell
silo [command]
```

| Command | Description |
| --- | --- |
| init | Setups a new silo instance |
| dev		| Runs a dev version on `localhost:8000`with file watching|
| run | Runs a production version |
| resources | Displays a list of current resources |
| data --resource [resource name] | Displays current data stored per resource |

### Silo structure

```
/
├── assets
├── build
├── cms
├── config
  ├── site.json
  └── settings.js
├── data
  └── [datafile].json
├── dist
├── schema
  └── [schema].json
├── scripts
├── src
  ├── scripts
  ├── views
    ├── pages
    ├── partials
    ├── layouts
  └── styles
├── tmp
├── .env
└── package.json
```


### Notes

- All settings are stored in a .env file in the root dir
