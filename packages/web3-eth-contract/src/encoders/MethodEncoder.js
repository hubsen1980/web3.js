/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file MethodEncoder.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

export default class MethodEncoder {

    /**
     * @param {ABICoder} abiCoder
     *
     * @constructor
     */
    constructor(abiCoder) {
        this.abiCoder = abiCoder;
    }

    /**
     * Encodes the method with the given parameters
     *
     * @method encode
     *
     * @param {ABIItemModel} abiItemModel
     * @param {String} deployData
     *
     * @returns {String|Error}
     */
    encode(abiItemModel, deployData) {
        let encodedParameters;

        try {
            encodedParameters = this.abiCoder.encodeParameters(
                abiItemModel.getInputs(),
                abiItemModel.contractMethodParameters
            ).replace('0x', '');
        } catch (error) {
            return error;
        }

        if (abiItemModel.signature === 'constructor') {
            if (!deployData) {
                return new Error(
                    'The contract has no contract data option set. This is necessary to append the constructor parameters.'
                );
            }

            return deployData + encodedParameters;
        }

        if (abiItemModel.isOfType('function')) {
            return abiItemModel.signature + encodedParameters;
        }

        return encodedParameters;
    }
}
