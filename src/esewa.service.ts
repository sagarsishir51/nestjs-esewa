import {BadRequestException, Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {
    ESEWA_CONFIG_OPTIONS,
    ESEWA_PAYMENT_TEST_URL,
    ESEWA_PAYMENT_URL,
    ESEWA_VALIDATE_MOBILE_URL,
    ESEWA_VALIDATE_TEST_URL,
    ESEWA_VALIDATE_URL,
    EsewaDto,
    EsewaOptions,
    EsewaRequestDto,
    PaymentMode
} from "./esewa.interface";
import {HttpService} from "@nestjs/axios";
import * as CryptoJS from 'crypto-js';
import {firstValueFrom} from "rxjs";

@Injectable()
export class EsewaService {
    private readonly paymentMode = null;
    private readonly productCode = null;
    private readonly paymentUrlTest = null;
    private readonly paymentUrl = null;
    private readonly validateUrlTest = null;
    private readonly validateUrl = null;
    private readonly validateUrlMobile = null;
    private readonly merchantId = null;
    private readonly merchantSecret = null;
    private readonly secretKey = null;

    constructor(@Inject(ESEWA_CONFIG_OPTIONS) private readonly options: EsewaOptions, private readonly httpService: HttpService) {
        if (!options.productCode) {
            throw new InternalServerErrorException("Product Code for esewa payment is missing")
        }
        if (!options.secretKey) {
            throw new InternalServerErrorException("Secret Ket for esewa payment is missing")
        }
        this.paymentMode = options.paymentMode || PaymentMode.TEST;
        this.productCode = options.productCode;
        this.paymentUrlTest = options.paymentUrlTest || ESEWA_PAYMENT_TEST_URL;
        this.paymentUrl = options.paymentUrl || ESEWA_PAYMENT_URL;
        this.validateUrlTest = options.validateUrlTest || ESEWA_VALIDATE_TEST_URL;
        this.validateUrl = options.validateUrl || ESEWA_VALIDATE_URL;
        this.validateUrlMobile = options.validateUrlMobile || ESEWA_VALIDATE_MOBILE_URL;
        this.merchantId = options.merchantId;
        this.merchantSecret = options.merchantSecret;
        this.secretKey = options.secretKey;
    }

    private static getMessage(fieldNameList: string[], data: object) {
        const keyValuePairs = fieldNameList.map(fieldName => `${fieldName}=${data[fieldName]}`);
        return keyValuePairs.join(',');
    }

    private static decodeBase64ToJson(encodedData: string) {
        const decodedBuffer = Buffer.from(encodedData, 'base64');
        const decodedData = decodedBuffer.toString('utf-8');
        return JSON.parse(decodedData);
    }

    init(data: EsewaRequestDto) {
        let {
            amount, productServiceCharge = 0, productDeliveryCharge = 0, taxAmount = 0, totalAmount, transactionUuid,
            successUrl, failureUrl
        } = data;
        if (!amount || !totalAmount || !transactionUuid || !successUrl || !failureUrl) {
            throw new BadRequestException("Data missing for initiating Esewa payment");
        }
        const requestData = {
            total_amount: totalAmount,
            transaction_uuid: transactionUuid,
            product_code: this.productCode
        }
        const fieldNameString = "total_amount,transaction_uuid,product_code"
        const message = EsewaService.getMessage(fieldNameString.split(','), requestData);
        const hashInBase64 = this.generateSignature(message)
        const esewaData: EsewaDto = {
            amount: amount.toString(),            // Amount of the product or item
            product_service_charge: productServiceCharge.toString(),              // Service charge by the merchant
            product_delivery_charge: productDeliveryCharge.toString(),               // Delivery charge by the merchant
            tax_amount: taxAmount.toString(),            // Tax amount on the product
            total_amount: totalAmount.toString(),            // Total payment amount including tax, service, and delivery charge
            transaction_uuid: transactionUuid,        // Unique ID of the product
            product_code: this.productCode, // Merchant code provided by eSewa
            success_url: successUrl,           // Success URL
            failure_url: failureUrl,         // Failure URL
            signed_field_names: fieldNameString,
            signature: hashInBase64
        };

        return {
            ...esewaData,
            payment_url:
                this.paymentMode.localeCompare(PaymentMode.TEST) == 0
                    ? this.paymentUrlTest
                    : this.paymentUrl,
        };
    }

    async verify(data: any) {
        const {encodedData} = data;
        if (!encodedData) {
            throw new BadRequestException('Data missing for validating eSewa payment');
        }
        const jsonData = EsewaService.decodeBase64ToJson(encodedData);
        /**
         * total_amount field contains comma which needs to be removed before generating signature
         * so that signature generated in server matches with the signature from encoded data
         */
        jsonData['total_amount'] = jsonData['total_amount']?.replace(',','');
        const {product_code, total_amount, transaction_uuid, signature, signed_field_names} = jsonData;
        const signedFieldNameList = signed_field_names.split(',');
        const message = EsewaService.getMessage(signedFieldNameList, jsonData);
        const serverSignature = this.generateSignature(message);
        if (signature.localeCompare(serverSignature) != 0) {
            throw new BadRequestException('Signature mismatch for validating eSewa payment');
        }
        const validateUrl =
            this.paymentMode.localeCompare('TEST') == 0
                ? this.validateUrlTest
                : this.validateUrl;
        return await firstValueFrom(
            this.httpService.get(
                `${validateUrl}?product_code=${this.productCode}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`,
            ),
        );
    }

    async verifyMobile(data: any) {
        if (!this.merchantId) {
            throw new InternalServerErrorException("Merchant Id for esewa payment is missing")
        }
        if (!this.merchantSecret) {
            throw new InternalServerErrorException("Merchant Secret for esewa payment is missing")
        }
        const {refId} = data;
        if (!refId) {
            throw new BadRequestException('Data missing for validating eSewa payment');
        }

        if (!this.merchantId) {
            throw new BadRequestException('Merchant ID is missing');
        }

        if (!this.merchantSecret) {
            throw new BadRequestException('Merchant Secret is missing');
        }
        const headers = {
            'merchantId': this.merchantId,
            'merchantSecret': this.merchantSecret,
        };
        // Add the headers to the options object
        const requestOptions = {
            headers,
        };
        return await firstValueFrom(
            this.httpService.get(
                `${this.validateUrlMobile}?txnRefId=${refId}`,
                requestOptions
            ),
        );

    }

    private generateSignature(message) {
        const hash = CryptoJS.HmacSHA256(message, this.secretKey);
        return CryptoJS.enc.Base64.stringify(hash);
    }
}
