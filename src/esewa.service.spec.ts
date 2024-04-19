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
        const data = await esewaService.verify({encodedData:"eyJ0cmFuc2FjdGlvbl9jb2RlIjoiMDAwN0JHNSIsInN0YXR1cyI6IkNPTVBMRVRFIiwidG90YWxfYW1vdW50IjoiNSwwMDAuMCIsInRyYW5zYWN0aW9uX3V1aWQiOiIzODciLCJwcm9kdWN0X2NvZGUiOiJFUEFZVEVTVCIsInNpZ25lZF9maWVsZF9uYW1lcyI6InRyYW5zYWN0aW9uX2NvZGUsc3RhdHVzLHRvdGFsX2Ftb3VudCx0cmFuc2FjdGlvbl91dWlkLHByb2R1Y3RfY29kZSxzaWduZWRfZmllbGRfbmFtZXMiLCJzaWduYXR1cmUiOiIwMG9ucFhucE5wMTJBSUV4amRvdWZXN2JxcmJGaCt5K0NZekxlc3VHWWZRPSJ9"});

        console.log("data",data?.data);
        expect(data?.data).toBeDefined();
        expect(data?.data).toHaveProperty("status")
        expect(data?.data).toHaveProperty("ref_id")
        expect(data?.data).toHaveProperty("transaction_uuid")
        expect(data?.data).toHaveProperty("total_amount")
    });
})