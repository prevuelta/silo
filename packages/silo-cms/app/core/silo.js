"use strict";

const $RefParser = require("json-schema-ref-parser");
const Promise = require("bluebird");
const glob = require("glob");
const path = require("path");
const { spawn } = require("child_process");
const { settings } = require("../../config");
const fs = require("fs");
const Data = require("./data");

const Ajv = require("ajv");
let ajv = new Ajv({
  v5: true,
  removeAdditional: "all",
  formats: {
    image: value => typeof value === "object",
    textarea: value => typeof value === "string",
    markup: value => typeof value === "string",
    asset: value => typeof value === "string",
    geo: value => typeof value === "object",
    checkboxes: value => typeof value === "array"
  }
});

ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
require("ajv-merge-patch")(ajv);

const protectedSchemaName = "silo-definitions";
const protectedSiloNames = ["admin", "silo", "files", "assets"];

const schemas = {};
const validations = {};
const defResolver = {
  order: 1,
  canRead: /silo*/,
  read: (file, cb) => {
    fs.readFile(
      `${settings.siloDir}/app/default-schema/silo-definitions.json`,
      cb
    );
  }
};

let loaded = false;

const schemaPath = `${settings.schemaDir}/!(_*)`;
const schemaFiles = glob.sync(schemaPath);
console.log(schemaPath, schemaFiles, process.cwd(), __dirname);

const schemaPromises = Promise.map(schemaFiles, s => {
  const schema = require(s);
  const name = path.basename(s, ".json");
  if (name.includes(protectedSchemaName)) {
    throw new Error(`'${name}' is a protected schema name`);
  }
  let dir = path.dirname(s);
  let ref = $RefParser.dereference(`${dir}/`, schema, {
    resolve: { def: defResolver }
  });
  return ref
    .then(dereferencedSchema => {
      schemas[name] = dereferencedSchema;
      schemas[name].$id = name;
      ajv.addSchema(dereferencedSchema);
      validations[name] = ajv.compile(dereferencedSchema);
      return true;
    })
    .catch(err => console.log(err));
});

schemaPromises.then(thing => {
  loaded = true;
});

module.exports = {
  validations,
  getSchemas() {
    return loaded ? Object.keys(schemas) : [];
  },
  getUsers() {
    return Data.getUsers();
  },
  getNode(node, sendSchema) {
    if (!loaded) {
      return new Promise();
    }
    const data = Data.getNode(node);
    return data.then(result => {
      return sendSchema
        ? {
            schema: schemas[node],
            data: result.data,
            meta: result.meta
          }
        : result;
    });
  },
  updateNode(node, data) {
    if (this.validations[node] && !this.validations[node](data.data)) {
      console.log("Error", this.validations[node].errors);
      return Promise.reject("Invalid Data");
    }
    // Validate the node!!!
    return Data.updateNode(node, data);
  },
  nodeExists(node) {
    return !!schemas[node];
  },
  getInfo() {
    return {
      name: "test",
      title: "Test",
      hooks: []
    };
  }
};
