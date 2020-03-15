"use strict";

import React, { Component } from "react";
import ContentForm from "../components/contentForm";
import { Req, Loader, Notify } from "../util";
import { store } from "../modules";

class ContentView extends Component {
  constructor(props) {
    super(props);
    const { resource } = props.match.params;
    this.state = {
      meta: null,
      data: null,
      schema: null,
      resource
    };
    if (resource) {
      this.loadContent(resource);
    }
  }

  componentWillReceiveProps(newProps) {
    const { resource } = newProps.match.params;
    if (this.state.resource !== resource) {
      store.set("isLoading", true);
      this.setState({ resource }, () => {
        this.loadContent(resource);
      });
    }
  }

  loadContent(resource) {
    return Req(`/admin/api/${resource}?schema=true`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.data || (res.schema.type === "object" ? {} : []),
          meta: res.meta,
          schema: res.schema
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        console.log("Finoshed loading content");
        store.set("isLoading", false);
      });
  }

  saveContent = data => {
    store.set("isLoading", true);
    Req(`/admin/api/${this.state.resource}`, "POST", {
      data: data.formData,
      meta: this.state.meta
    })
      .then(async res => {
        if (res.status === 200) {
          Notify.message("Document saved");
        } else {
          Notify.alert("Problem saving document");
        }
        window.scrollTo(0, 0);
        await this.loadContent(this.state.resource);
      })
      .catch(err => {
        if (err) {
          err.text().then(errText => {
            Notify.alert(errText || "Problem saving document");
          });
        } else {
          Notify.alert("Problem saving document");
        }
      })
      .finally(() => {
        store.set("isLoading", false);
        console.log("Finished saving");
      });
  };

  render() {
    const { data, meta, schema } = this.state;
    return data ? (
      <ContentForm
        data={data}
        meta={meta}
        schema={schema}
        onSubmit={this.saveContent}
      />
    ) : (
      <Loader />
    );
  }
}

export default ContentView;
