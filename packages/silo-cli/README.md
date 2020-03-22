# silo-cli [NOT FUNCTIONAL - WIP]

### Setting up
To create a new silo instance, run 
`silo init` in an empty folder.

`silo dev` will run a local version on the port you specified or default `8080`

### Api

```shell
silo [command]
```

| Command | Description |
| --- | --- |
| init | Setups a new silo instance |
| dev		| Runs a dev version on `localhost:8000`with file watching|
<!-- | run | Runs a production version | -->
<!-- | resources | Displays a list of current resources | -->
<!-- | data --resource [resource name] | Displays current data stored per resource | -->



### Notes

- All settings are stored in a .env file in the root dir
