package com.vs.ecommerce.service;

import com.vs.ecommerce.dto.Purchase;
import com.vs.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
