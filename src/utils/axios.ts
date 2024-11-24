import axios from 'axios';

export const axiosInstance = axios.create({
  timeout: 5000,
});



export const BASE_URL = 'http://localhost:8080/api';

export const SERVICE_ROUTES = {
  PRODUCT_SERVICE: "products"
}

export const fetchProductVariantDetails = async (productVariantId: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/${SERVICE_ROUTES.PRODUCT_SERVICE}/v1/cart-item-service/${productVariantId}`);
  return response.data;
};