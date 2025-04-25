import {EsewaService} from "./esewa.service";
import {EsewaOptions, EsewaRequestDto, PaymentMode} from "./esewa.interface";
import {HttpService} from "@nestjs/axios";

describe('EsewaService', () => {
    let data:EsewaOptions={
        paymentMode: PaymentMode.TEST, productCode: "EPAYTEST", secretKey: "8gBm/:&EnhH.1/q"
    }
    let esewaService: EsewaService;

    beforeEach(() => {
        esewaService = new EsewaService(data,new HttpService());
    });

    it('should be defined', () => {
        expect(esewaService).toBeDefined();
    });

    it('should init data', async () => {
        const requestDto:EsewaRequestDto = {
            amount: 10,
            productServiceCharge: 0,
            productDeliveryCharge: 0,
            taxAmount: 0,
            totalAmount: 10,
            transactionUuid: "TRN_1",
            successUrl: "http://localhost:3000/payment-success",
            failureUrl: "http://localhost:3000/payment-failure"
        }

        const data = esewaService.init(requestDto);
        expect(data).toBeDefined();
        expect(data).toHaveProperty("amount")
        expect(data).toHaveProperty("product_service_charge")
        expect(data).toHaveProperty("product_delivery_charge")
        expect(data).toHaveProperty("tax_amount")
        expect(data).toHaveProperty("total_amount")
        expect(data).toHaveProperty("transaction_uuid")
        expect(data).toHaveProperty("product_code")
        expect(data).toHaveProperty("success_url")
        expect(data).toHaveProperty("failure_url")
        expect(data).toHaveProperty("signed_field_names")
        expect(data).toHaveProperty("signature")
        expect(data).toHaveProperty("payment_url")
    });


    it('should verify data', async () => {
        const data = await esewaService.verify({encodedData:
            "eyJ0cmFuc2FjdGlvbl9jb2RlIjoiMDAwQUNJUSIsInN0YXR1cyI6IkNPTVBMRVRFIiwidG90YWxfYW1vdW50IjoiMS4wIiwidHJhbnNhY3Rpb25fdXVpZCI6IlRFU1RfSUQyNCIsInByb2R1Y3RfY29kZSI6IkVQQVlURVNUIiwic2lnbmVkX2ZpZWxkX25hbWVzIjoidHJhbnNhY3Rpb25fY29kZSxzdGF0dXMsdG90YWxfYW1vdW50LHRyYW5zYWN0aW9uX3V1aWQscHJvZHVjdF9jb2RlLHNpZ25lZF9maWVsZF9uYW1lcyIsInNpZ25hdHVyZSI6IkhMRzFic1kvK0h2SkVaNUQyMzdhbFF6K21NODNQeVdwSkxneVJQZ3l0c2c9In0="
        });
        expect(data).toBeDefined();
        expect(data).toHaveProperty("status")
        expect(data).toHaveProperty("refId")
        expect(data).toHaveProperty("transactionUuid")
        expect(data).toHaveProperty("totalAmount")
    });
})