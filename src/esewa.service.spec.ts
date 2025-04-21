import {EsewaService} from "./esewa.service";
import {EsewaOptions, PaymentMode} from "./esewa.interface";
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

    it('should verify data', async () => {
        const data = await esewaService.verify({encodedData:
            "eyJ0cmFuc2FjdGlvbl9jb2RlIjoiMDAwQUNJUSIsInN0YXR1cyI6IkNPTVBMRVRFIiwidG90YWxfYW1vdW50IjoiMS4wIiwidHJhbnNhY3Rpb25fdXVpZCI6IlRFU1RfSUQyNCIsInByb2R1Y3RfY29kZSI6IkVQQVlURVNUIiwic2lnbmVkX2ZpZWxkX25hbWVzIjoidHJhbnNhY3Rpb25fY29kZSxzdGF0dXMsdG90YWxfYW1vdW50LHRyYW5zYWN0aW9uX3V1aWQscHJvZHVjdF9jb2RlLHNpZ25lZF9maWVsZF9uYW1lcyIsInNpZ25hdHVyZSI6IkhMRzFic1kvK0h2SkVaNUQyMzdhbFF6K21NODNQeVdwSkxneVJQZ3l0c2c9In0="
        });

        console.log("data",data);
        expect(data).toBeDefined();
        expect(data).toHaveProperty("status")
        expect(data).toHaveProperty("refId")
        expect(data).toHaveProperty("transactionUuid")
        expect(data).toHaveProperty("totalAmount")
    });
})