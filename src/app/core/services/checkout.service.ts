import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from 'rxjs';


/**
 * CheckoutService
 *
 * Manages checkout state and processes orders.
 */
@Injectable({
    providedIn: 'root',
})
export class CheckoutService {
    constructor(private readonly httpClient: HttpClient) { }

    async processOrder(orderData: any): Promise<void> {
        await firstValueFrom(this.httpClient.post('/api/checkout', orderData));
    }
}