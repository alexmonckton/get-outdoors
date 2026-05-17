import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
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
    private readonly base = `${environment.apiBaseUrl}/checkout`;

    async processOrder(orderData: any): Promise<void> {
        await firstValueFrom(this.httpClient.post(this.base, orderData));
    }
}