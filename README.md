## Introduction
This is a simple wrapper for Esewa Payment extended from [@dallotech/nestjs-esewa](https://github.com/DalloTech/nestjs-esewa). It supports Epay-V2 and transaction verification for the Esewa SDK, but more will be added later. Just ping us or open a pull request and contribute :)

## Installation

```bash
$ npm i --save nestjs-esewa 
$ yarn add nestjs-esewa 
```

#### Importing module Async

```typescript
import { EsewaModule } from 'nestjs-esewa';
@Module({
  imports: [
      EsewaModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService<AllConfig>) => ({
              productCode: configService.get("----your key-----", {infer: true}),
              paymentMode: configService.get("----your key-----", {infer: true}),
              secretKey: configService.get("----your key-----", {infer: true}),
              merchantId: configService.get("----your key-----", {infer: true}),
              merchantSecret: configService.get("----your key-----", {infer: true}),
          })
      }),
  ],
  providers: [],
  exports: [],
})
export class YourModule {}
```
#### Calling Init Method to initialize payment

```typescript
import { EsewaService,EsewaRequestDto } from 'nestjs-esewa';

@Injectable()
export class YourService {
  constructor(private esewaService: EsewaService) {}
    
    async initPayment(){
        //...your code
        const esewaRequestDto: EsewaRequestDto = {
            amount: 10,
            productServiceCharge: 0,
            productDeliveryCharge: 0,
            taxAmount: 0,
            totalAmount: 10,
            transactionUuid: 'random uuid of txn',
            successUrl: 'success return url of frontend',
            failureUrl: 'failure return url of frontend'
        };
        const initData = await this.esewaService.init(esewaRequestDto);
        //...use initData where required as use case
    
  }
}
```

#### Calling Verify Method for Epay-V2

```typescript
import { EsewaService } from 'nestjs-esewa';

@Injectable()
export class YourService {
  constructor(private esewaService: EsewaService) {}
    
    async verifyPayment(data){
        //...your code
        const {encodedData} = data;
        const response = await this.esewaService.verify({encodedData});
        //..your code can verify the response data with your business logic and response format
  }
}
```

#### Calling Verify Method for Esewa SDK

```typescript
import { EsewaService,SparrowSmsRequestDto } from 'nestjs-esewa';

@Injectable()
export class YourService {
  constructor(private esewaService: EsewaService) {}
    
    async verifyPayment(data){
        //...your code
        const {refId} = data;
        const response = await this.esewaService.verifyMobile({refId});
        //..your code can verify the response data with your business logic and response format
  }
}
```

## License

This package is MIT licensed.
