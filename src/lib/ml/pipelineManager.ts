import { MLPipeline } from './MLPipeline.js';
import axios from 'axios';

let pipeline: MLPipeline | null = null;
let products: any[] = [];

export async function getPipeline() {
  if (!pipeline) {
    try {
      const response = await axios.get("https://dummyjson.com/products?limit=194");
      products = response.data.products;
      pipeline = new MLPipeline(products);
      
      // Initial "warm-up" training with some synthetic data
      await pipeline.buildNeuralCF(100, 200);
      
      const userIndices = [];
      const productIndices = [];
      const labels = [];
      
      for (let i = 0; i < 1000; i++) {
        userIndices.push(Math.floor(Math.random() * 100));
        productIndices.push(Math.floor(Math.random() * 194));
        labels.push(Math.random() > 0.7 ? 1 : 0);
      }
      
      await pipeline.trainNCF(userIndices, productIndices, labels);
      console.log("ML Pipeline initialized and warmed up.");
    } catch (error) {
      console.error("Failed to initialize ML Pipeline:", error);
    }
  }
  return pipeline;
}

export function getProducts() {
  return products;
}
