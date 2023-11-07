import {FactoryProvider, ModuleMetadata} from "@nestjs/common";

export const ESEWA_CONFIG_OPTIONS = 'ESEWA_CONFIG_OPTIONS'
export const ESEWA_PAYMENT_TEST_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
export const ESEWA_PAYMENT_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
export const ESEWA_VALIDATE_TEST_URL = 'https://epay.esewa.com.np/api/epay/transaction/status/'
export const ESEWA_VALIDATE_URL = 'https://epay.esewa.com.np/api/epay/transaction/status/'
export const ESEWA_VALIDATE_MOBILE_URL = 'https://esewa.com.np/mobile/transaction'

export enum PaymentMode {
    TEST = 'TEST',
    LIVE = 'LIVE',
}

export interface EsewaRequestDto {
    //Amount of product
    amount: number;
    //product_service_charge Service charge by merchant on product
    productServiceCharge: number;
    //Delivery charge by merchant on product
    productDeliveryCharge: number;
    //Tax amount applied on product
    taxAmount: number;
    //Total payment amount including tax, service and deliver charge. [i.e total_amount= amount+ tax_amount+ product_service_charge + product_delivery_charge ]
    totalAmount: number;
    //A unique ID of product, should be unique on every request
    transactionUuid: string;
    //Success URL: a redirect URL of merchant application where customer will be redirected after SUCCESSFUL transaction
    successUrl: string;
    //Failure URL: a redirect URL of merchant application where customer will be redirected after FAILURE or PENDING transaction
    failureUrl: string;
}

export interface EsewaDto {
    //Amount of product
    amount: string;
    //product_service_charge Service charge by merchant on product
    product_service_charge: string;
    //Delivery charge by merchant on product
    product_delivery_charge: string;
    //Tax amount applied on product
    tax_amount: string;
    //Total payment amount including tax, service and deliver charge. [i.e total_amount= amount+ tax_amount+ product_service_charge + product_delivery_charge ]
    total_amount: string;
    //A unique ID of product, should be unique on every request
    transaction_uuid: string;
    //Merchant code provided by eSewa
    product_code: string;
    //Success URL: a redirect URL of merchant application where customer will be redirected after SUCCESSFUL transaction
    success_url: string;
    //Failure URL: a redirect URL of merchant application where customer will be redirected after FAILURE or PENDING transaction
    failure_url: string;
    //Unique field names to be sent which is used for generating signature
    signed_field_names: string;
    //hmac signature generated through above process.
    signature: string;
}

export interface EsewaOptions {
    productCode: string;
    secretKey: string;
    paymentUrlTest?: string;
    paymentUrl?: string;
    validateUrlTest?: string;
    validateUrl?: string;
    validateUrlMobile?: string;
    paymentMode: PaymentMode;
    merchantId?: string;
    merchantSecret?: string;
}


type EsewaAsyncOptions =
    Pick<ModuleMetadata, 'imports'>
    & Pick<FactoryProvider<EsewaOptions>, 'useFactory' | 'inject'>;


export default EsewaAsyncOptions;