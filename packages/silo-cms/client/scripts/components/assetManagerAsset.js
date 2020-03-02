'use strict';

import React from 'react';
import { MiniLoader } from '../util/loader';
import Icon from './icons';

const { Fragment } = React;

const AssetPreview = props => {
    const { name, ext } = props.asset || {};
    const { isImage } = props;
    return props.loading ? (
        <MiniLoader />
    ) : props.asset ? (
        <div className="asset-preview">
            {isImage ? (
                <img src={`/image/thumb/${name}`} />
            ) : (
                <div className="asset-icon">{ext}</div>
            )}
            {isImage && props.children}
        </div>
    ) : (
        <p>
            <strong>None selected</strong>
        </p>
    );
};

const Asset = props => {
    const { asset, selected, deleteAsset, selectAsset } = props;
    const { name, mime } = asset;
    const isImage = mime && mime.includes('image');
    return (
        <div
            className={`asset-item ${selected ? 'selected' : ''} ${
                isImage ? 'image-asset' : ''
            }`}>
            <AssetPreview asset={asset} isImage={isImage}>
                <div className="hover-preview">
                    <button
                        type="button"
                        className="delete-file"
                        onClick={deleteAsset}>
                        <Icon.X />
                    </button>
                    <img src={`/image/thumb/${name}`} />
                    <p>{name}</p>
                    <button
                        disabled={selected}
                        type="button"
                        className="small"
                        onClick={selectAsset}>
                        {selected ? 'Selected' : 'Select'}
                    </button>
                </div>
            </AssetPreview>
            <p title={name} className="file-title">
                {name}
            </p>
            <button
                disabled={selected}
                type="button"
                className="small"
                onClick={selectAsset}>
                {selected ? 'Selected' : 'Select'}
            </button>
        </div>
    );
};

export { AssetPreview };
export default Asset;
