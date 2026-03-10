import * as tf from '@tensorflow/tfjs-node';
import natural from 'natural';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export class MLPipeline {
  private products: any[] = [];
  private tfidf = new natural.TfIdf();
  private ncfModel: tf.LayersModel | null = null;

  constructor(products: any[]) {
    this.products = products;
    this.initializeContentBased();
  }

  private initializeContentBased() {
    this.products.forEach((p, i) => {
      const text = `${p.title} ${p.description} ${p.category} ${p.brand} ${p.tags?.join(' ')}`;
      this.tfidf.addDocument(text);
    });
  }

  public getSimilarProducts(productId: number, topN: number = 10) {
    const targetIdx = this.products.findIndex(p => p.id === productId);
    if (targetIdx === -1) return [];

    const scores: { index: number; score: number }[] = [];
    this.tfidf.tfidfs(this.products[targetIdx].description, (i, score) => {
      if (i !== targetIdx) {
        // Boost by sentiment
        const productSentiment = this.analyzeSentiment(this.products[i].reviews || []);
        scores.push({ index: i, score: score * (1 + productSentiment) });
      }
    });

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map(s => this.products[s.index]);
  }

  public analyzeSentiment(reviews: any[]) {
    if (!reviews || reviews.length === 0) return 0;
    const scores = reviews.map(r => sentiment.analyze(r.comment).comparative);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  public async buildNeuralCF(nUsers: number, nProducts: number) {
    const embeddingDim = 16;

    const userInput = tf.input({ shape: [1], name: 'user' });
    const prodInput = tf.input({ shape: [1], name: 'product' });

    const userEmbed = tf.layers.embedding({
      inputDim: nUsers + 1,
      outputDim: embeddingDim,
      embeddingsInitializer: 'glorotNormal'
    }).apply(userInput) as tf.SymbolicTensor;

    const prodEmbed = tf.layers.embedding({
      inputDim: nProducts + 1,
      outputDim: embeddingDim,
      embeddingsInitializer: 'glorotNormal'
    }).apply(prodInput) as tf.SymbolicTensor;

    const userFlat = tf.layers.flatten().apply(userEmbed) as tf.SymbolicTensor;
    const prodFlat = tf.layers.flatten().apply(prodEmbed) as tf.SymbolicTensor;

    const merged = tf.layers.concatenate().apply([userFlat, prodFlat]) as tf.SymbolicTensor;

    let dense = tf.layers.dense({ units: 64, activation: 'relu' }).apply(merged) as tf.SymbolicTensor;
    dense = tf.layers.dropout({ rate: 0.2 }).apply(dense) as tf.SymbolicTensor;
    dense = tf.layers.dense({ units: 32, activation: 'relu' }).apply(dense) as tf.SymbolicTensor;
    
    const output = tf.layers.dense({ units: 1, activation: 'sigmoid' }).apply(dense) as tf.SymbolicTensor;

    this.ncfModel = tf.model({ inputs: [userInput, prodInput], outputs: output });
    this.ncfModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return this.ncfModel;
  }

  public async trainNCF(userIndices: number[], productIndices: number[], labels: number[]) {
    if (!this.ncfModel) return;

    const uTensor = tf.tensor2d(userIndices, [userIndices.length, 1]);
    const pTensor = tf.tensor2d(productIndices, [productIndices.length, 1]);
    const lTensor = tf.tensor2d(labels, [labels.length, 1]);

    await this.ncfModel.fit([uTensor, pTensor], lTensor, {
      epochs: 10,
      batchSize: 32,
      validationSplit: 0.2,
      shuffle: true
    });

    uTensor.dispose();
    pTensor.dispose();
    lTensor.dispose();
  }

  public async predict(userId: number, productIds: number[]) {
    if (!this.ncfModel) return productIds.map(() => Math.random());

    const uTensor = tf.tensor2d(new Array(productIds.length).fill(userId), [productIds.length, 1]);
    const pTensor = tf.tensor2d(productIds, [productIds.length, 1]);

    const preds = this.ncfModel.predict([uTensor, pTensor]) as tf.Tensor;
    const data = await preds.data();

    uTensor.dispose();
    pTensor.dispose();
    preds.dispose();

    return Array.from(data);
  }
}
