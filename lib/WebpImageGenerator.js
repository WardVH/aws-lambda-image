"use strict";

const path = require("path");
const fs = require("fs");
const ImageData = require("./ImageData");
const {CWebp} = require("cwebp");

if (!fs.existsSync("/usr/local/bin/cwebp")) {
    const RESOURCES_DIR = path.join(__dirname, "resources");
    process.env.PATH += `:${RESOURCES_DIR}`;
    process.env.LD_LIBRARY_PATH += `:${RESOURCES_DIR}`;
}

class WebpImageGenerator {

    /**
     * Webp image generator
     *
     * @constructor
     * @param Object option
     */
    constructor(option) {
        this.option = option || {};
    }

    /**
     * Execute process
     *
     * @public
     * @param ImageData image
     * @return Promise
     */
    exec(image) {
        const option = this.option;
        let encoder = CWebp(image.data);

        console.log("Generating a webp variant of the image");

        return encoder.toBuffer()
            .then((buffer) => {

                let key = image.combineWithDirectory({
                    directory: option.directory,
                    template: option.template,
                    prefix: option.prefix,
                    suffix: option.suffix,
                    keepExtension: false
                });

                console.log('new key: ' + key);

                return new ImageData(
                    key,
                    option.bucket || image.bucketName,
                    buffer,
                    image.headers,
                    option.acl || image.acl
                )
            });
    }
}

module.exports = WebpImageGenerator;
