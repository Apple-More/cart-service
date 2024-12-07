import axios from 'axios';
import { API_GATEWAY_URL } from '../config';

export const SERVICE_ROUTES = {
  PRODUCT_SERVICE: 'products',
};

export const axiosInstance = axios.create({
  timeout: 10000,
});

export const fetchProductVariantDetails = async (productVariantId: string) => {
  const response = await axiosInstance.get(
    `${API_GATEWAY_URL}/${SERVICE_ROUTES.PRODUCT_SERVICE}/v1/cart-item-service/${productVariantId}`,
  );
  return response.data;
};
