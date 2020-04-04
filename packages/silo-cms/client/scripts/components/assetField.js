"use strict";

import AssetManager from "./assetManager";
import Modal from "./modal";
import React, { Component } from "react";
import Req from "../util/request";
import moment from "moment";
import { AssetPreview } from "./assetManagerAsset";

class Asset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.formData,
      selectingAsset: false,
      asset: null,
      loading: !!props.formData,
    };
  }

  componentDidMount() {
    if (this.state.value && !this.state.asset) {
      this._getAssetInfo();
    }
  }

  _getAssetInfo() {
    Req(`/admin/asset/${this.state.value}`)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          this._clear();
        }
      })
      .then(info => {
        this.setState({ asset: info });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  _clear() {
    this._selectAsset(null);
  }

  _toggleAssetManager(show = true) {
    this.setState({ selectingAsset: show });
  }

  _selectAsset(asset) {
    this.setState(
      {
        asset,
        value: asset ? asset.name : undefined,
      },
      () => this.props.onChange(this.state.value)
    );
  }

  render() {
    const { value, selectingAsset, asset, loading } = this.state;
    const created =
      asset && moment(asset.ctime).format("ddd DD MMM YYYY h:mma");
    return (
      <div className="asset flex-row">
        <AssetPreview asset={asset} loading={loading} />
        {asset && (
          <div>
            <p>
              <strong>{value}</strong>
              <br />
              Type: {asset.mime || "unknown"} <br />
              Filesize: {asset.size} <br />
              Created: {created}
            </p>
          </div>
        )}
        <button type="button" onClick={() => this._toggleAssetManager()}>
          Select asset
        </button>
        <button type="button" onClick={() => this._clear()}>
          Clear
        </button>
        <Modal full={true} isVisible={selectingAsset}>
          <h2>Select asset</h2>
          <AssetManager
            selectedAsset={asset}
            onSelect={asset => this._selectAsset(asset)}
          />
          <button type="button" onClick={() => this._toggleAssetManager(false)}>
            Done
          </button>
        </Modal>
      </div>
    );
  }
}

export default Asset;
